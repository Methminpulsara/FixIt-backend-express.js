const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../../utils/generateToken');

exports.registerUser = async (data) => {
    const { email, username, password } = data;

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        ...data,
        password: hashedPassword
    });

    return {
        user,
        token: generateToken(user._id)
    };
};

exports.loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid email");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error("Invalid password");

    return {
        user,
        token: generateToken(user._id)
    };
};
