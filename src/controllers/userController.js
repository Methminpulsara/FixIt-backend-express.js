const User = require("../models/User");
const applyUserPrivacy = require("../utils/applyUserPrivacy");

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        const result = applyUserPrivacy(user, req.viewer);

        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
