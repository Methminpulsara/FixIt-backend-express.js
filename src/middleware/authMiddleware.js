const jwt =  require("jsonwebtoken");


module.exports = (req , res , next) =>{ 

    const authHeader = req.headers.authorization;

    
    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status()
    }


    const token = authHeader.split(" ")[1];

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;
        next()

    } catch (error) {
        res.status(400),json({message: "Invalid token - authMiddleware"})
    }


}