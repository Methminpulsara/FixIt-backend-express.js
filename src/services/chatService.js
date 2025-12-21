const chatRepository = require('../repositories/chatRepository')

exports.getChatHistory = async(requestId)=>{
    return await chatRepository.findByRequestId(requestId);
}