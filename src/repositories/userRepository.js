const User = require('../models/User');

exports.findByEmail = (email) => User.findOne({ email });

exports.createUser = (data) => User.create(data);

exports.findById = (id) => User.findById(id).select('-password');

exports.updateById = (id, data) =>
  User.findByIdAndUpdate(id, data, { new: true }).select('-password');

exports.updateVisibility = (id, visibilitySettings) =>
  User.findByIdAndUpdate(id, { visibilitySettings }, { new: true }).select('-password');

exports.updateByIdLocation = (id, lngOrData, lat) => {
  let updateData;

  if (typeof lngOrData === 'object' && lngOrData !== null) {
    updateData = lngOrData;
  } else {
    updateData = {
      location: {
        type: 'Point',
        coordinates: [Number(lngOrData), Number(lat)],
      },
    };
  }

  return User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
};

exports.UpdateUserProfilePic = (id, profilePic) =>
  User.findByIdAndUpdate(id, { profilePic }, { new: true }).select('-password');
