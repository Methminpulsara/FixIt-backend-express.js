const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../../utils/generateToken');
const userRepo = require('../../repositories/userRepository')



exports.registerUser = async (body) => {
    const { email, username, password } = body;

    // Check existing user
    const exists = await userRepo.findByEmail(email);
    if (exists) throw new Error("User already exists");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await userRepo.createUser({
        ...body,
        password: hashedPassword,
    });

    return {
        user,
        token: generateToken(user._id)
    };
};

exports.loginUser = async ({ email, password }) => {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error("Invalid email or Password");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error("Invalid email or Password ");

    return {
        user,
        token: generateToken(user._id)
    };
};

