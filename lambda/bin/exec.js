const lambda = require('../build/' + global.process.argv[2])

const event = global.process.argv[3] ? JSON.parse(global.process.argv[3].replace(/'/g, '"')) : {}

lambda.handler(event, null, (err, result) => {
    if (err) {
        console.error(err)
    } else {
        console.log(result)
    }
}).then(() => {
    console.log('DONE')
}, err => {
    console.error('ERROR', err)
})
