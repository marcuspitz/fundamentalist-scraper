const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')
const del = require('del')
const gulp = require('gulp')
const zip = require('gulp-zip')

async function runCmd(cmd, cwd) {
    return new Promise((resolve, reject) => {
        childProcess.exec(cmd, { maxBuffer: 1024 * 1024, cwd }, (err, stdout) => err ? reject(err) : resolve(stdout))
    })
}

const BUILD_DIR = path.resolve(__dirname, '../build')

function getBundleName(lambdaName) {
    return `${lambdaName}.zip`
}

function clean() {
    return del([ BUILD_DIR ])
}

function compile() {
    return runCmd('npx --no-install tsc -p ./lambda/tsconfig.build.json', path.resolve(__dirname, '../..'))
}

function build(lambdaName) {
    return runCmd('npm run build', lambdaName)
}

function bundle(lambdaName) {
    return runCmd('npm run bundle', lambdaName)
}

function makeZip(lambdaName) {
    const bundleFilename = getBundleName(lambdaName)

    return new Promise((resolve, reject) => {
        const exists = fs.existsSync(`${BUILD_DIR}/index.js`)
        if (!exists) {
            return reject(new Error('Input file not found: index.js'))
        }
        return gulp.src([
            `${BUILD_DIR}/node_modules/**/*`,
            `${BUILD_DIR}/index.js`,
            `${BUILD_DIR}/index.js.map`,
        ], { base: BUILD_DIR, nodir: true, allowEmpty: false })
            .pipe(zip(bundleFilename))
            .pipe(gulp.dest(BUILD_DIR))
            .on('end', () => resolve(bundleFilename))
            .on('error', reject)
    })
}

module.exports = {
    BUILD_DIR,
    runCmd,
    getBundleName,
    clean,
    compile,
    build,
    bundle,
    makeZip,
}
