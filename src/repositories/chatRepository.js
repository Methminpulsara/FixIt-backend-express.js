const Message = require('../models/Message')

exports.findByRequestId = (requestId)=>{
    return Message.find({requestId}).sort({createdAt:1})
}