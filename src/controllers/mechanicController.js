const mechanicService = require("../services/mechanicService");
const Mechanic = require('../models/Mechanic')

exports.createProfile = async (req, res) => {
    try {
        if (req.user.type !== "mechanic") {
            return res.status(403).json({ message: "Only mechanics can apply" });
        }

        let mechanicData = { ...req.body };
        if (typeof mechanicData.skills === 'string') {
            mechanicData.skills = JSON.parse(mechanicData.skills);
        }

        const documents = {};
        if (req.files) {
            if (req.files.nic) documents.nic = req.files.nic[0].path;
            if (req.files.certificate) documents.certificate = req.files.certificate[0].path;
        }
        
        mechanicData.documents = documents;

        const result = await mechanicService.createMechanicProfile(req.user.id, mechanicData);
        
        res.status(201).json({ success: true, profile: result });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
}

exports.getProfile = async (req, res) => {
    try {
        const result = await mechanicService.getMechanicProfile(req.user.id);
        if (!result) return res.status(404).json({ message: "Mechanic profile not found" });
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const updatedProfile = await mechanicService.updateMechanicProfile(req.user.id, req.body);
        if (!updatedProfile) {
            return res.status(404).json({ message: "Mechanic profile not found" });
        }
        res.json({ success: true, profile: updatedProfile });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.uploadMechanicDocument = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "ෆයිල් එකක් එවන්න" });
        
        const { docType } = req.body;
        const fileUrl = `/uploads/${req.file.filename}`;
        
        const result = await mechanicService.uploadMechanicDoc(req.user.id, docType, fileUrl);
        res.status(200).json({ success: true, url: fileUrl, data: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};