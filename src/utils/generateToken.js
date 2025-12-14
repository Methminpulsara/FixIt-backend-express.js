const jwt = require('jsonwebtoken');

module.exports = (user) => {
    return jwt.sign(
        {
            id: user._id,
            type: user.type   // 👈 VERY IMPORTANT
        },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );
};
