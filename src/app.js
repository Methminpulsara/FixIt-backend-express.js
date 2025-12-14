const express = require('express');
const cors = require('cors');
const privacy = require('./middleware/privacy');

const authRouter = require("./routes/auth/auth");
const userRoutes = require("./routes/userRoutes");
const mechaniRoutes = require("./routes/mechanicRoutes")
const adminRouters = require("./routes/adminRoutes")

const app = express();

app.use(cors());
app.use(express.json());
app.use(privacy);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1", userRoutes);
app.use("/api/v1/mechanic/profile" , mechaniRoutes);
app.use("/api/v1/admin", adminRouters)

app.get("/", (req, res) => res.send("works"));

module.exports = app;
