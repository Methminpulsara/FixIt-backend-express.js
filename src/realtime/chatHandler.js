// src/realtime/chatHandler.js
const Message = require('../models/Message'); // Messgae -> Message ලෙස නිවැරදි කළා

module.exports = (io, socket, onlineUsers) => {
    console.log("🛠️ Chat Handler attached to socket:", socket.id); // මේක වැටෙනවද බලන්න

    // 1. පණිවිඩ යැවීමේ Logic එක
    const sendMessage = async (data) => {
        const { requestId, receiverId, message } = data;
        const senderId = socket.userId;

        if (!senderId) {
            console.error("❌ Sender ID not found on socket. Register first.");
            return;
        }

        console.log(`💬 Message from ${senderId} to ${receiverId}: ${message}`);

        try {
            // DB එකේ Save කිරීම
            const newMessage = new Message({
                requestId,
                senderId,
                receiverId,
                message
            });
            await newMessage.save();

            // Receiver Online ද බලන්න 
            const receiverSocketId = onlineUsers.get(receiverId);

            if (receiverSocketId) {
                // receive_meesage -> receive_message ලෙස නිවැරදි කළා
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

    // 2. පණිවිඩ කියවූ බව සටහන් කිරීම (Mark as Read)
    const markAsRead = async (data) => {
        const { requestId, senderId } = data; // senderId = පණිවිඩය එවපු කෙනා
        const currentUserId = socket.userId;

        try {
            // අදාළ Request එකේ, මට ලැබුණු (receiverId = currentUserId), 
            // තවම read නොකළ පණිවිඩ true කරන්න
            await Message.updateMany(
                { requestId, senderId, receiverId: currentUserId, isRead: false },
                { $set: { isRead: true } }
            );

            // පණිවිඩ එවපු කෙනාට (sender) දැනුම් දෙනවා දැන් පණිවිඩ බලලා ඉවරයි කියලා (Seen Status)
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

    // Socket Events ලියාපදිංචි කිරීම
    socket.on("send_message", sendMessage);
    socket.on("mark_as_read", markAsRead);
};