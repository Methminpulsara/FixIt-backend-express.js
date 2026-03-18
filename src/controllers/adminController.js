const adminService = require('../services/adminService');

exports.getPendingMechanics = async (req, res) => {
  try {
    const result = await adminService.findPending();
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Cannot get pending mechanics' });
  }
};

exports.getMechanicHistory = async (req, res) => {
  try {
    const result = await adminService.findMechanicHistory();
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Cannot get mechanic history' });
  }
};

exports.approveMechanics = async (req, res) => {
  try {
    const result = await adminService.approveMechanic(req.params.id);
    if (!result) return res.status(404).json({ message: 'Mechanic profile not found' });
    res.json({ success: true, mechanic: result });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Cannot approve mechanic.' });
  }
};

exports.rejectMechanics = async (req, res) => {
  try {
    const result = await adminService.rejectMechanic(req.params.id);
    if (!result) return res.status(404).json({ message: 'Mechanic profile not found' });
    res.json({ success: true, mechanic: result });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Cannot reject mechanic.' });
  }
};

exports.getPendingGarages = async (req, res) => {
  try {
    const result = await adminService.findPendingGarages();
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Cannot get pending garages' });
  }
};

exports.getGarageHistory = async (req, res) => {
  try {
    const result = await adminService.findGarageHistory();
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Cannot get garage history' });
  }
};

exports.approveGarages = async (req, res) => {
  try {
    const result = await adminService.approveGarage(req.params.id);
    if (!result) return res.status(404).json({ message: 'Garage profile not found' });
    res.json({ success: true, garage: result });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Cannot approve garage.' });
  }
};

exports.rejectGarages = async (req, res) => {
  try {
    const result = await adminService.rejectGarage(req.params.id);
    if (!result) return res.status(404).json({ message: 'Garage profile not found' });
    res.json({ success: true, garage: result });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Cannot reject garage.' });
  }
};
