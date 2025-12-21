const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const express = require('express');
const cors = require('cors');
const privacy = require('./middleware/privacy');


const authRouter = require("./routes/auth/auth");
const userRoutes = require("./routes/userRoutes");
const mechaniRoutes = require("./routes/mechanicRoutes")
const adminRouters = require("./routes/adminRoutes")
const garageRoutes = require('./routes/garageRoutes')
const requestRoutes = require('./routes/requestRoutes')
const chatRoutes = require('./routes/chatRoutes')


const app = express();

app.use(cors());
app.use(express.json());
app.use(privacy);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1", userRoutes);
app.use("/api/v1/mechanic/profile" , mechaniRoutes);
app.use("/api/v1/admin", adminRouters)
app.use("/api/v1/garage" , garageRoutes)
app.use("/api/v1/request", requestRoutes)
app.use("/api/v1/chat" , chatRoutes)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get("/", (req, res) => res.send("works"));

module.exports = app;
