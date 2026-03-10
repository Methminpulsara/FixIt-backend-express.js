const User = require("../models/User");
const registerChatHandler = require('./chatHandler')

const onlineUsers = new Map();

exports.initLocationSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("✅ Socket connected:", socket.id);

        socket.on("register", (userId) => {
            console.log("Register event received for ID:", userId);
            socket.userId = userId;
            onlineUsers.set(userId, socket.id);
            console.log(`User registered: ${userId} with socket: ${socket.id}`);
        });

        socket.on("updateLocation", async (data) => {
            const { userId, lat, lng } = data;

            if (!userId || lat === undefined || lng === undefined) return;

            try {
                await User.findByIdAndUpdate(userId, {
                    location: {
                        type: "Point",
                        coordinates: [lng, lat]
                    }
                });

                socket.broadcast.emit("locationUpdate", {
                    userId,
                    lat,
                    lng
                });

                console.log("update socket workds !")

            } catch (error) {
                console.error("Location update error:", error.message);
            }
        });


        registerChatHandler(io,socket, onlineUsers);


        socket.on("disconnect", () => {
            if (socket.userId) {
                onlineUsers.delete(socket.userId);
                console.log("❌ Socket disconnected:", socket.userId);
            }
        });
    });
};

exports.getOnlineUsers = () => onlineUsers;