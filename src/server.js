require('dotenv').config();
console.log("JWT SECRET => ", process.env.JWT_SECRET);


const authRouter = require("./routes/auth/auth.js")
const privacy = require('./middleware/privacy')

const express = require('express');
const cors  = require('cors');  
const connectDB = require('./config/db')

connectDB()
const app = express();



app.use(privacy);
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1", require("./routes/userRoutes"))


app.get('/', (req , res) => {
    res.send("works")
})

const port = 5000;
app.listen(port, () => console.log("Server is running on port " + port));
