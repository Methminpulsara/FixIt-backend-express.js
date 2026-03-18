const User = require('../models/User');
const applyUserPrivacy = require('../utils/applyUserPrivacy');
const userService = require('../services/UserService');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const result = applyUserPrivacy(user, req.viewer);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const data = await userService.getMyProfile(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateMyProfile = async (req, res) => {
  try {
    const data = await userService.updateMyProfile(req.user.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateVisibiitySettings = async (req, res) => {
  try {
    const result = await userService.updateVisibilitySettings(req.user.id, req.body);
    res.json({ success: true, visibility: result.visibilitySettings });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const updated = await userService.updateLocation(req.user.id, { lat, lng });
    res.json({ success: true, location: updated.location });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select Image' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    const userId = req.user.id;

    await userService.updateProfileImage(userId, imageUrl);

    res.status(200).json({
      success: true,
      message: 'Profile Picture Uploaded',
      url: imageUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
