const chatService = require('../services/chatService')

exports.getChatHistory = async (req, res) => {
    try {
        const { requestId } = req.params;

        if (!requestId) {
            return res.status(400).json({ message: "Request ID එක අවශ්‍යයි." });
        }

        const messages = await chatService.getChatHistory(requestId);
        
        res.status(200).json({
            success: true,
            count: messages.length,
            messages: messages
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.print = (req, res) => {
    res.send("WADA");
};