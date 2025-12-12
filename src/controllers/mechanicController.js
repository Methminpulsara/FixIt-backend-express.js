const mechanicService = require("../services/MechanicService");

exports.createProfile = async (req, res) => {
    try {
        const result = await mechanicService.createMechanicProfile(req.user.id, req.body);
        res.json({ success: true, profile: result });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const result = await mechanicService.getMechanicProfile(req.user.id);
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const result = await mechanicService.createMechanicProfile(req.user.id, req.body);
        res.json({ success: true, profile: result });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};