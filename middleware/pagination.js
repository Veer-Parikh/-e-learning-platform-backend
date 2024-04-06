const logger = require("../utils/logger")

const pagination = (model) =>{
    return async (req,res,next) => {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const startIndex = (page-1)*limit
        const endIndex = page*limit 

        const result = {}

        if(endIndex < model.length) {
            result.next = {
                page:page+1,
                limit:limit
            }
        }

        if(startIndex > 0) {
            result.previous = {
                page:page-1,
                limit:limit
            }
        }
        try{
            result.result = await model.find().limit(limit).skip(startIndex).exec()
            req.pagination = result
            next()
        } catch(e) {
            logger.error(e)
        }
    }
}