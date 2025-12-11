const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
    console.log("Connected!", socket.id);
});

socket.emit("updateLocation", {
    userId: "693a7c90648f6a3ad52f6918",
    lat: 73241.2298,
    lng: 79.8589
});

socket.on("locationUpdate", (data) => {
    console.log("SERVER PASSED:", data);
});

module.exports = socket