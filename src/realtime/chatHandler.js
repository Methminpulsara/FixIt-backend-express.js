const Messgae = require('../models/Message')

module.exports = (io,socket, onlineUsers)=>{

    const sendMessage = async (data) =>{
        const {requestId , receiverId , message} = data
        const senderId = socket.userId;

        console.log(`Message from ${senderId} to ${receiverId} : ${message}`)

        try {
            
            // save in DB
            const newMessage = new Messgae ({
                requestId:requestId,
                senderId:senderId,
                receiverId:receiverId,
                message:message
            });
            
            await newMessage.save();

            // check receiver online or not 
            const receiverSocketId = onlineUsers.get(receiverId);

            if(receiverSocketId){
                io.to(receiverSocketId).emit("receive_meesage",{
                    requestId,
                    senderId,
                    message,
                    timeStams : newMessage.createdAt
                })
                console.log("🚀 Message delivered in real-time.");
            
            }else{
                console.log("📴 Receiver is offline. Message saved to DB.");
            }

        } catch (error) {
            console.error("❌ Chat error:", error.message);
        }
    };
    socket.on("send_message", sendMessage);

};