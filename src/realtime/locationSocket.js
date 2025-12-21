const User = require("../models/User");
const registerChatHandler = require('./chatHandler')

// දැනට online ඉන්න අයගේ userId සහ socketId store කිරීමට
const onlineUsers = new Map();

exports.initLocationSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("✅ Socket connected:", socket.id);

        // 1. User කෙනෙක් connect වුණු ගමන් ඔහුගේ UserId එක socket එකට register කිරීම
        socket.on("register", (userId) => {
            console.log("Register event received for ID:", userId);
            socket.userId = userId;
            onlineUsers.set(userId, socket.id);
            console.log(`User registered: ${userId} with socket: ${socket.id}`);
        });

        // 2. Location Update කිරීම (Live)
        socket.on("updateLocation", async (data) => {
            const { userId, lat, lng } = data;

            if (!userId || lat === undefined || lng === undefined) return;

            try {
                // DB එකේ Location එක Update කිරීම
                // 💡 Optimization: හැම තත්පරේම DB update නොකර, විනාඩියකට වරක් වගේ කරන එක වඩාත් හොඳයි.
                await User.findByIdAndUpdate(userId, {
                    location: {
                        type: "Point",
                        coordinates: [lng, lat] // [longitude, latitude]
                    }
                });

                // අසල සිටින අයට හෝ අදාළ පාර්ශවයට දැනුම් දීමට broadcast කිරීම
                // මෙතැනදී හැමෝටම නොයවා, අවශ්‍ය අයට පමණක් යැවීමට logic පසුව එකතු කළ හැක.
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


        // CHAt HANDELER 
        registerChatHandler(io,socket, onlineUsers);


        // 3. Socket එක disconnect වූ විට onlineUsers ලැයිස්තුවෙන් ඉවත් කිරීම
        socket.on("disconnect", () => {
            if (socket.userId) {
                onlineUsers.delete(socket.userId);
                console.log("❌ Socket disconnected:", socket.userId);
            }
        });
    });
};

// 💡 අපිට වෙනත් තැන් වලදී (Controllers) පාවිච්චි කරන්න export එකක්
exports.getOnlineUsers = () => onlineUsers;