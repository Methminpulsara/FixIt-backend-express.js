require('dotenv').config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { initLocationSocket } = require("./realtime/locationSocket");

connectDB(); // Connect DB first

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: { origin: "*" }
});
app.set("socketio", io); 

// Initialize socket module
initLocationSocket(io);

const PORT = process.env.PORT || 5001;

server.listen(PORT, () =>
  console.log("🚀 Server + WebSocket running on port " + PORT)
);
