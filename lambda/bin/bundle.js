const del = require('del')
const gulp = require('gulp')

const { runCmd, BUILD_DIR } = require('./_common')

async function copyPackageJson() {
    return new Promise((resolve, reject) => {
        return gulp.src([
            'package.json',
        ], { nodir: true, allowEmpty: false })
            .pipe(gulp.dest(BUILD_DIR))
            .on('end', resolve)
            .on('error', reject)
    })
}

function install() {
    return runCmd('npm i --production --no-package-lock', BUILD_DIR)
}

function prune() {
    return runCmd('npm prune --no-package-lock', BUILD_DIR)
}

function clean() {
    return del([
        'package.json',
        'package-lock.json',
    ], { cwd: BUILD_DIR })
}

async function run() {
    try {
        await clean()
        await copyPackageJson()
        await install()
        await prune()
    } catch (err) {
        console.error(err)
    }
}

run()
