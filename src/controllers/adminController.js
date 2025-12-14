const adminService = require('../services/adminService')



exports.getPendingMechanics =  async (req, res)=>{
    try {
        const result = await adminService.findPending();
        res.json(result)
    } catch (error) {
        res.status(400).json({message:"cant get pending mechanics"})
    }
}


exports.approveMechanics = async (req, res) =>{
    try {
        
        const result = adminService.approveMechanic(req.params.id);
        res.json({ success: true, mechanic: result });
    } catch (error) {
        res.status(400).status({message: "can't approve you"})
    }
}

exports.rejectMechanics = async (req, res) =>{
    try {
        
        const result = adminService.rejectMechanic(req.params.id);
        res.json({ success: true, mechanic: result });
    } catch (error) {
        res.status(400).status({message: "can't reject you"})
    }
}