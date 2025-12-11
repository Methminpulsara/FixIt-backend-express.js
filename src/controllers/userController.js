const User = require("../models/User");
const applyUserPrivacy = require("../utils/applyUserPrivacy");
const userService = require('../services/UserService')

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        const result = applyUserPrivacy(user, req.viewer);

        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


// OWN PROFILE MANAGE
exports.getMyProfile = async (req, res) => {
    try {
        const data = await userService.getMyProfile(req.user.id);
        res.json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.updateMyProfile = async (req, res) => {  // ← Controller name change
    try {
        const data = await userService.updateMyProfile(req.user.id, req.body);
        res.json({ success: true, data });
        log(req.body)
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


//visibiltyUpdate krnn 
exports.updateVisibiitySettings = async (req , res ) =>{
    try {
        const result = await userService.updateVisibilitySettings(
            req.user.id,
            req.body
        )

        res.json({success:true , visibility:result.visibilitySettings})
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}


exports.updateLocation = async (req, res) => {
    const { lat, lng } = req.body;

    const updated = await userService.updateLocation(req.user.id, { lat, lng });

    res.json({
        success: true,
        location: updated.location
    });
};
