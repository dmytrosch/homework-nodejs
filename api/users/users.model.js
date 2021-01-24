const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

module.exports = UserModel;
