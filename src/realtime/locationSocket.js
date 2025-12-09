const User = require("../models/User")


exports.initLocationSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("Socket connected :", socket.id);

        socket.on("updateLocation", async (data) => {
            const { userId, lat, lng } = data;

            // Listent to frontend event
            if (!userId || !lat || !lng) { return; }

            await User.findByIdAndUpdate(userId, {
                location: { lat, lng }
            });

            io.emit("locationUpdate", {
                userId,
                lat,
                lng
            })
        })

        socket.on("disconnect", () => {
            console.log("Socket disconnected", socket.id);
        })
    })



}