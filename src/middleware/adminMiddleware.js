

module.exports = (req , res , next)=>{

    if(req.user.type !== "admin"){
        return res.status(403).json({message: `Only for admin ! your  type is ${req.user.type}`})
    }
    next();
};