// src/controllers/garageController.js

const garageService = require('../services/garageService');

exports.createProfile = async (req, res) => {
    try {
        if (req.user.type !== "garage") {
            return res.status(403).json({ message: "Only garage users can create a profile." });
        }
        const result = await garageService.createGarageProfile(req.user.id, req.body);
        res.status(201).json({ success: true, profile: result });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const result = await garageService.getGarageProfile(req.user.id);
        if (!result) return res.status(404).json({ message: "Garage profile not found" });
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const updatedProfile = await garageService.updateGarageProfile(req.user.id, req.body);
        if (!updatedProfile) {
            return res.status(404).json({ message: "Garage profile not found" });
        }
        res.json({ success: true, profile: updatedProfile });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.uploadGaragePhoto = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "පින්තූරයක් එවන්න" });

        const fileUrl = `/uploads/${req.file.filename}`;
        
        const result = await garageService.uploadGaragePhoto(req.user.id, fileUrl);
        res.status(200).json({ success: true, url: fileUrl, data: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};