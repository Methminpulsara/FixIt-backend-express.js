// const mechanicService = require("../services/mechanicService");

// exports.createProfile = async (req, res) => {
//     try {
//         if(req.user.type !== "mechanic") res.status(403).josn({message:"only mecanics can apply"});
//         const result = await mechanicService.createMechanicProfile(req.user.id, req.body);
//         res.json({ success: true, profile: result });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };

// exports.getProfile = async (req, res) => {
//     try {
//         const result = await mechanicService.getMechanicProfile(req.user.id);
//         res.json(result);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };

// exports.updateProfile = async (req, res) => {
//     try {
//         const updatedProfile = await mechanicService.updateMechanicProfile(req.user.id, req.body);
//         if (!updatedProfile) {
//             return res.status(404).json({ message: "Mechanic profile not found" });
//         }
//         res.json({ success: true, profile: updatedProfile });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };

const mechanicService = require("../services/mechanicService");

exports.createProfile = async (req, res) => { // 💡 async
    try {
        if(req.user.type !== "mechanic") return res.status(403).json({message:"only mechanics can apply"}); // 💡 .json()
        const result = await mechanicService.createMechanicProfile(req.user.id, req.body); // 💡 await
        res.status(201).json({ success: true, profile: result });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getProfile = async (req, res) => { // 💡 async
    try {
        const result = await mechanicService.getMechanicProfile(req.user.id); // 💡 await
        if (!result) return res.status(404).json({ message: "Mechanic profile not found" });
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateProfile = async (req, res) => { // 💡 async
    try {
        const updatedProfile = await mechanicService.updateMechanicProfile(req.user.id, req.body); // 💡 await
        if (!updatedProfile) {
            return res.status(404).json({ message: "Mechanic profile not found" });
        }
        res.json({ success: true, profile: updatedProfile });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};