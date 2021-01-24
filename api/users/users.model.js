const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subscription: {
        type: String,
        enum: ["free", "pro", "premium"],
        default: "free",
    },
    token: { type: String, default: "" },
});
const UserModel = mongoose.model("user", userSchema);

UserModel.hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 6);
    return hashedPassword;
};
UserModel.verifyPassword = async (password, hashedPassword) => {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    return isPasswordValid;
};
UserModel.createJWT = (user) => {
    const token = jwt.sign(
        { id: user._id, subscription: user.subscription },
        process.env.JWT_SECRET
    );
    user.token = token;
    user.save();
};

module.exports = UserModel;
