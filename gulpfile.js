'use strict';

let production = false;
let watching = false;
const ci = process.argv.includes('--ci');

// Module Requires
const path = require('path');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const del = require('del');
const zip = require('gulp-zip');
const git = require('gulp-git');
const childProcess = require('child_process');
const fs = require('fs');
const exec = childProcess.exec;
const spawn = childProcess.spawn;
const AWS = require('aws-sdk');
const waitOn = require('wait-on');
var sass = require('gulp-sass');

// Gulp paths and options
const SERVER_DIR = './server';
const SERVER_BUILD_DIR = './build';
const SERVER_BUILD_SERVER_DIR = './build/server';
const BUNDLES_DIR = './bundles';

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const minCommitHashLength = 7;
const commitHashLength = 8;

// Clean up build directory
gulp.task('clean', () => {
    return del([SERVER_BUILD_DIR]);
});

gulp.task('quiet-lint', () => {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(['server/**/*.ts'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint({
            quiet: true
        }))
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

gulp.task('lint', () => {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(['server/**/*.ts'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

gulp.task('fix-lint', () => {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(['server/**/*.ts'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint({
            fix: true
        }))
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

// Server build

function writeConfig(headRev) {
    fs.writeFileSync('config.prod.js', `module.exports = {hash: '${headRev}'};\r\n`);
}

gulp.task('build-server', (cb) => {
    const watchFlag = watching ? '--watch' : '';
    const ret = exec(`tsc --project ${SERVER_DIR}/tsconfig.build.json ${watchFlag}`);
    ret.stdout.on('data', (data) => {
        const asString = typeof data === 'string' ? data : data.toString('utf8');
        console.error(asString);
    });
    ret.on('close', () => cb());
});

gulp.task('build-sass', function () {
    return gulp.src(`${SERVER_DIR}/public/stylesheets/*.scss`)
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest(path.join(SERVER_BUILD_SERVER_DIR, 'public/stylesheets')));
});

gulp.task('build-public', () => {        
    return gulp.src([`${SERVER_DIR}/public/**/*`, `!${SERVER_DIR}/public/stylesheets/*`])
        .pipe(gulp.dest(path.join(SERVER_BUILD_SERVER_DIR, 'public')));
});

gulp.task('build-composed', gulp.parallel(
    gulp.task('build-public'),
    gulp.task('build-sass'),
));

// Build task
gulp.task('build', gulp.parallel(
    gulp.task('build-composed'),
    gulp.task('build-server'),
));

// Watch function
const watch = gulp.series(
    function preWatch() {
        console.log('Watching server changes...');
        watching = true;

        return revParse('--short HEAD').then(headRev => {
            writeConfig(headRev);
        });
    },
    gulp.parallel(
        gulp.task('build'),
        function watcher(cb) {
            gulp.watch(`${SERVER_DIR}/public/**/*`, gulp.task('build-composed'));
            waitOn({
                resources: [
                    path.join(SERVER_BUILD_SERVER_DIR, 'index.js'),
                ],
                delay: 5000,
            }, err => {
                if (err) {
                    return cb(err);
                }
                runCmd(npmCmd, ['run', 'watch']).catch(cb);
            });
        },
    ),
);

gulp.task('dev', watch);

// Production build process
gulp.task('production', gulp.series(
    async function preProduction() {
        console.log('Building for production...');
        production = true;
    },
    gulp.task('clean'),
    gulp.task('build'),
));

function revParse(args) {
    return new Promise((resolve) => {
        git.revParse({ args: args, quiet: true }, function (err, result) {
            if (err) console.error('git.revParse:', err);

            resolve(result);
        });
    })
}

function gitStatus() {
    return new Promise((resolve, reject) => {
        git.status({ args: '--porcelain', quiet: true }, function (err, stdout) {
            if (err) {
                return reject(err);
            }

            if (stdout.trim()) {
                reject(new Error('Commit your changes before proceeding'));
            } else {
                resolve();
            }
        });
    });
}

function gitPull() {
    return new Promise((resolve, reject) => {
        git.pull(null, null, { args: '--no-rebase', quiet: true }, function (err, stdout) {
            if (err) {
                return reject(err);
            }

            resolve();
        });
    });
}

function gitContains(branch, hash) {
    return new Promise((resolve, reject) => {
        const onRemotes = branch.startsWith('origin/') ? ' -r' : '';
        git.branch(branch, { args: '--contains ' + hash + onRemotes, quiet: true }, function (err, stdout) {
            if (err) {
                if (err.message.indexOf('malformed object name') >= 0) {
                    return resolve(false);
                }
                return reject(err);
            }

            if (!stdout.trim()) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

/**
 * @returns {Promise<string>}
 */
function hasAppVersion() {
    const eb = new AWS.ElasticBeanstalk({ region: 'us-east-1' });
    return Promise.all([
        revParse(`--short=${commitHashLength} HEAD`),
        eb.describeApplicationVersions({ VersionLabels: [] }).promise(),
    ]).then(async ([head, appVersions]) => {
        if (appVersions.ApplicationVersions.find(it => it.VersionLabel.includes(head))) {
            return head;
        }
    });
}

gulp.task('check-app', async () => {
    if (await hasAppVersion()) {
        process.exitCode = 1;
    }
})

function beanstalkStatus() {
    if (ci) {
        return Promise.resolve();
    }
    const eb = new AWS.ElasticBeanstalk({ region: 'us-east-1' });
    return Promise.all([
        revParse('--abbrev-ref HEAD'),
        eb.describeEnvironments({ EnvironmentNames: ['rjt-staging'] }).promise(),
        hasAppVersion(),
    ]).then(async ([currentBranch, deployedVersion, appVersion]) => {
        if (appVersion) {
            throw new Error(`An application version for <${appVersion}> was already built.`);
        }
        const env = deployedVersion.Environments[0];
        const version = env.VersionLabel.split('-').filter(it => it.length >= minCommitHashLength);
        const commitHash = version[version.length - 1].split('@')[0];
        const inMaster = await gitContains('origin/master', commitHash);
        if (!inMaster && commitHash !== 'Sample Application') {
            throw new Error(`Branch <origin/master> does not contain commit <${commitHash}>.`)
        }
        const inBranch = await gitContains(currentBranch, commitHash);
        if (!inBranch && commitHash !== 'Sample Application') {
            throw new Error(`Branch <${currentBranch}> does not contain commit <${commitHash}>.`);
        }
        return env.VersionLabel;
    });
}

function runCmd(command, args, { cwd = undefined, output = true } = {}) {
    return new Promise((resolve, reject) => {
        const ret = spawn(command, args, { cwd, stdio: output ? 'inherit' : 'ignore' });
        ret.on('close', code => code ? reject(code) : resolve());
    });
}

function npmInstall() {
    return runCmd(npmCmd, ['run', 'update']);
}

function bundle() {
    return Promise.all([
        revParse('--abbrev-ref HEAD'),
        revParse(`--short=${commitHashLength} HEAD`),
    ]).then(([branch, headRev]) => {
        return zipIt(branch, headRev);
    });
}

function makeBundleFilename(branch, headRev) {
    if (ci) {
        return 'application.zip';
    }
    const date = new Date().toISOString().substring(0, 10).replace(/-/g, '');
    return `${date}-${branch}-${headRev}.zip`;
}

function zipIt(branch, headRev) {
    const bundleFilename = makeBundleFilename(branch, headRev);

    writeConfig(headRev);
    return gulp.src([
        `${SERVER_BUILD_DIR}/**/*`,
        './config.prod.js',
        './.npmrc',
        './package.json',
        './.ebextensions/**/*'
    ], { base: '.', nodir: true })
        .on('end', () => console.log('Bundle filename:', bundleFilename))
        .pipe(zip(bundleFilename))
        .pipe(gulp.dest(BUNDLES_DIR));
}

gulp.task('deploy', gulp.series(
    gitStatus,
    gitPull,
    beanstalkStatus,
    npmInstall,
    gitStatus,
    gulp.task('production'),
    bundle,
));

gulp.task('redeploy', gulp.series(
    gitStatus,
    gitPull,
    async function redeploy() {
        const branch = await revParse('--abbrev-ref HEAD');
        const headRev = await revParse(`--short=${commitHashLength} HEAD`);
        const filename = makeBundleFilename(branch, headRev);
        if (!fs.existsSync(filename)) {
            throw new Error(filename + ' is missing locally; required for re-deploy.');
        }
        let newFilename;
        let i = 1;
        do {
            i++;
            newFilename = filename.replace('.zip', `@${i}.zip`);
        } while (fs.existsSync(newFilename));
        fs.copyFileSync(filename, newFilename);
        setImmediate(() => console.log('Bundle filename:', newFilename));
    },
));

gulp.task('default', gulp.task('dev'));
