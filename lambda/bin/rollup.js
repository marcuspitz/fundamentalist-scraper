const path = require('path')
const rollup = require('rollup')
const localResolve = require('rollup-plugin-local-resolve')

const { BUILD_DIR, compile } = require('./_common')

const lambdaName = path.basename(process.cwd())

async function build() {
    const bundle = await rollup.rollup({
        input: path.join(BUILD_DIR, 'lambda', lambdaName, 'index.js'),
        plugins: [
            localResolve(),
        ],
        external(id) {
            return /^[\w-]+$/.test(id)
        },
    })
    await bundle.write({
        file: path.join(BUILD_DIR, 'index.js'),
        format: 'cjs',
        name: 'Lambda',
        sourcemap: true,
    })
}

async function run() {
    try {
        await compile()
        await build()
    } catch (err) {
        console.error(`[${lambdaName}]:`, err)
        process.exitCode = 1
    }
}

run()
