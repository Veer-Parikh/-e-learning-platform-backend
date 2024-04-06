const pino = require('pino')

const logger = pino({
    transport:{
        target:"pino-pretty",
        options:{
            translateTime:true,
            ignore:"pid,hostname",
        }
    }
})

module.exports = logger