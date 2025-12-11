const User = require("../models/User")


exports.initLocationSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("Socket connected :", socket.id);

     socket.on("updateLocation", async (data) => {
    const { userId, lat, lng } = data;
    if (!userId || lat === undefined || lng === undefined) return;

    await User.findByIdAndUpdate(userId, {
        location: {
            type: "Point",
            coordinates: [lng, lat]
        }
    }, { new: true });

    io.emit("locationUpdate", {
        userId,
        lat,
        lng
    });
});


        socket.on("disconnect", () => {
            console.log("Socket disconnected", socket.id);
        })
    })



}