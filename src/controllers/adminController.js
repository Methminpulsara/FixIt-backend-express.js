const adminService = require('../services/adminService');

// --- MECHANIC FUNCTIONS ---

// Pending Mechanics 
exports.getPendingMechanics = async (req, res) => {
    try {
        const result = await adminService.findPending();
        res.json(result);
    } catch (error) {
       
        res.status(400).json({ message: error.message || "Cannot get pending mechanics" });
    }
};

// Mechanic Approve 
exports.approveMechanics = async (req, res) => {
    try {
        const result = await adminService.approveMechanic(req.params.id);
        if (!result) return res.status(404).json({ message: "Mechanic profile not found" });
        res.json({ success: true, mechanic: result });
    } catch (error) {
       
        res.status(400).json({ message: error.message || "Cannot approve mechanic." });
    }
};

// Mechanic Reject 
exports.rejectMechanics = async (req, res) => {
    try {
        const result = await adminService.rejectMechanic(req.params.id);
        if (!result) return res.status(404).json({ message: "Mechanic profile not found" });
        res.json({ success: true, mechanic: result });
    } catch (error) {
    
        res.status(400).json({ message: error.message || "Cannot reject mechanic." });
    }
};


// --- GARAGE FUNCTIONS (නවතම එකතු කිරීම) ---

// Pending Garages ලබා ගැනීම
exports.getPendingGarages = async (req, res) => {
    try {
        const result = await adminService.findPendingGarages();
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message || "Cannot get pending garages" });
    }
};

// 5. Garage Approve කිරීම
exports.approveGarages = async (req, res) => {
    try {
        const result = await adminService.approveGarage(req.params.id);
        if (!result) return res.status(404).json({ message: "Garage profile not found" });
        res.json({ success: true, garage: result });
    } catch (error) {
        res.status(400).json({ message: error.message || "Cannot approve garage." });
    }
};

// 6. Garage Reject කිරීම
exports.rejectGarages = async (req, res) => {
    try {
        const result = await adminService.rejectGarage(req.params.id);
        if (!result) return res.status(404).json({ message: "Garage profile not found" });
        res.json({ success: true, garage: result });
    } catch (error) {
        res.status(400).json({ message: error.message || "Cannot reject garage." });
    }
};