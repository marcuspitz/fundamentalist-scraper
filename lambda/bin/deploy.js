const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const AWS = require('aws-sdk')
const { forEach, map } = require('lodash')

const { LAMBDAS } = require('../config')
const { BUILD_DIR, clean, compile, build, bundle, makeZip } = require('./_common')

const PUBLISH = false

const lambda = new AWS.Lambda({ region: 'us-west-2' })

async function getFunction(functionName) {
    return lambda.getFunction({
        FunctionName: functionName,
    }).promise()
}

async function getFunctionArn(functionName) {
    const fn = await getFunction(functionName)
    return fn.Configuration.FunctionArn
}

async function getTags(functionName) {
    const fn = await getFunction(functionName)
    return fn.Tags
}

async function tagResource(functionName, tags) {
    const functionArn = await getFunctionArn(functionName)
    return lambda.tagResource({
        Resource: functionArn,
        Tags: tags,
    }).promise()
}

function readFile(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, (err, data) => {
            if (err) {
                return reject(err)
            }
            resolve(data)
        })
    })
}

async function computeHash(filename, packageJson) {
    const hash = crypto.createHash('sha256')

    const data = await readFile(filename)
    hash.update(data)

    const json = JSON.parse(await readFile(packageJson))
    const pkgs = await Promise.all(map(json.dependencies, async (value, key) => {
        const innerPackageJson = packageJson.replace('/package.json', `/node_modules/${key}/package.json`)
        return JSON.parse(await readFile(innerPackageJson))
    }))
    forEach(pkgs, (pkg) => {
        hash.update(pkg.name)
        hash.update(pkg.version)
    })

    return hash.digest('hex')
}

async function updateFunctionCode(lambdaName) {
    const bundleFilename = await makeZip(lambdaName)
    const zip = await readFile(path.join(BUILD_DIR, bundleFilename))

    const functionName = LAMBDAS[lambdaName]
    return lambda.updateFunctionCode({
        FunctionName: functionName,
        Publish: PUBLISH,
        ZipFile: zip,
    }).promise()
}

async function needsToUpdate(lambdaName) {
    const nextSha = await computeHash('./build/index.js', './build/package.json')
    const functionName = LAMBDAS[lambdaName]
    const tags = await getTags(functionName)
    const currentSha = tags && tags['checksum']
    return currentSha !== nextSha ? nextSha : null
}

async function deployFunction(lambdaName) {
    const nextSha = await needsToUpdate(lambdaName)
    if (!nextSha) {
        return false
    }

    await updateFunctionCode(lambdaName)
    const functionName = LAMBDAS[lambdaName]
    await tagResource(functionName, {
        'checksum': nextSha,
        'version': process.env.BITBUCKET_COMMIT,
    })
    return true
}

async function makeLambda(lambdaName) {
    await build(lambdaName)
    await bundle(lambdaName)
    const result = await deployFunction(lambdaName)
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

            const result = await makeLambda(lambdaName)
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
        console.log('New versions deployed:')
        for (let i = 0; i < updated.length; i++) {
            console.log('* ', updated[i])
        }
    } else {
        console.log('No new versions deployed.')
    }
}

run()
