const { LAMBDAS } = require('../config')
const { clean, compile, build, bundle, makeZip } = require('./_common')

async function makeBundle(lambdaName) {
    await build(lambdaName)
    await bundle(lambdaName)
    const result = await makeZip(lambdaName)
    return result
}

async function run() {
    try {
        await clean()
        await compile()
    } catch (err) {
        console.error(`[compile]:`, err)
        process.exitCode = 1
        return
    }

    const updated = []
    const lambdas = Object.keys(LAMBDAS)
    const length = lambdas.length
    for (let i = 0; i < length; i++) {
        const lambdaName = lambdas[i]
        try {
            console.log(`(${i + 1}/${length})`, 'Building:', lambdaName)

            const result = await makeBundle(lambdaName)
            if (result) {
                updated.push(lambdaName)
            }
        } catch (err) {
            console.error(`[${lambdaName}]:`, err)
            process.exitCode = 1
        }
    }

    console.log('')
    if (updated.length) {
        console.log('New versions bundled:')
        for (let i = 0; i < updated.length; i++) {
            console.log('* ', updated[i])
        }
    } else {
        console.log('No new versions bundled.')
    }
}

run()
