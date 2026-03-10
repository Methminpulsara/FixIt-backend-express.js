const Message = require('../models/Message'); 

module.exports = (io, socket, onlineUsers) => {
    console.log("🛠️ Chat Handler attached to socket:", socket.id); 

// send messge 
    const sendMessage = async (data) => {
        const { requestId, receiverId, message } = data;
        const senderId = socket.userId;

        if (!senderId) {
            console.error("❌ Sender ID not found on socket. Register first.");
            return;
        }

        console.log(`💬 Message from ${senderId} to ${receiverId}: ${message}`);

        try {
            // save in the DB 
            const newMessage = new Message({
                requestId,
                senderId,
                receiverId,
                message
            });
            await newMessage.save();

            const receiverSocketId = onlineUsers.get(receiverId);

            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receive_message", {
                    requestId,
                    senderId,
                    message,
                    timestamp: newMessage.createdAt
                });
                console.log("🚀 Message delivered in real-time.");
            } else {
                console.log("📴 Receiver is offline. Message saved to DB.");
            }

        } catch (error) {
            console.error("❌ Chat error:", error.message);
        }
    };

    const markAsRead = async (data) => {
        const { requestId, senderId } = data; 
        const currentUserId = socket.userId;

        try {
           
            await Message.updateMany(
                { requestId, senderId, receiverId: currentUserId, isRead: false },
                { $set: { isRead: true } }
            );

        
            const senderSocketId = onlineUsers.get(senderId);
            if (senderSocketId) {
                io.to(senderSocketId).emit("messages_seen", { 
                    requestId, 
                    seenBy: currentUserId 
                });
                console.log(`👀 Seen status sent to ${senderId}`);
            }
        } catch (error) {
            console.error("❌ Seen status error:", error.message);
        }
    };

    socket.on("send_message", sendMessage);
    socket.on("mark_as_read", markAsRead);
};