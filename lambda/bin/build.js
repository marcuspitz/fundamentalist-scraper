const { LAMBDAS } = require('../config')
const { clean, compile } = require('./_common')

async function run() {
    try {
        await clean()
        console.log(await compile())
    } catch (err) {
        console.error(`[compile]:`, err)
        process.exitCode = 1
        return
    }
}

run()
