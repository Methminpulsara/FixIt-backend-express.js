const User = require("../models/User");

exports.findById = (id) => {
    return User.findById(id).select("-password");
};

exports.findByEmail = (email) => {
    return User.findOne({ email });
};

exports.createUser = (data) => {
    return User.create(data);
};


exports.updateById = async (id, updates) => {  // ← async add කරන්න
    return User.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true  // ← Validation run කරන්න
    }).select("-password");
};
