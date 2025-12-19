const User = require("../models/User");
const jwt = require("jsonwebtoken");


module.exports = async (req, res, next) => {

    try {
        const header = req.headers.authorization || "";
        const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

        if (!token) {
            req.viewer = null;
            return next();
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        req.viewer = user || null;
        next();
    } catch (err) {
        req.viewer = null;
        next();
    }
};
