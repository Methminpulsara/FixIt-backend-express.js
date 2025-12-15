// const jwt =  require("jsonwebtoken");


// module.exports = (req , res , next) =>{ 

//     const authHeader = req.headers.authorization;

    
//     if(!authHeader || !authHeader.startsWith("Bearer")){
//         return res.status()
//     }


//     const token = authHeader.split(" ")[1];



const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;   // 🔥 NOW req.user.type EXISTS
        next();

    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
