require('dotenv').config();

const express = require('express');
const cors  = require('cors');  // <-- fix here

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req , res) => {
    res.send("works")
})

const port = 5000;
app.listen(port, () => console.log("Server is running on port " + port));
