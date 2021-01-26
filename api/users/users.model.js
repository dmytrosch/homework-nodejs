const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatarURL: String,
    subscription: {
        type: String,
        enum: ["free", "pro", "premium"],
        default: "free",
    },
    token: { type: String, default: "" },
});
const UserModel = mongoose.model("user", userSchema);

userSchema.statics.hashPassword = async function (password){
    const hashedPassword = await bcrypt.hash(password, 6);
    return hashedPassword;
};
userSchema.methods.verifyPassword = async (password) => {
    const isPasswordValid = await bcrypt.compare(password, this.password);
    return isPasswordValid;
};

userSchema.methods.createJWT = () => {
    const token = jwt.sign(
        { id: this._id, subscription: this.subscription },
        process.env.JWT_SECRET
    );
    this.token = token;
    this.save();
};

module.exports = UserModel;
