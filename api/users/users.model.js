const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateAvatar = require("../utils/avatarGenerator");
const path = require("path");
const {v4: uuidv4} = require('uuid')
const sendEmail = require('../utils/verificationEmailToSend')
const createAvatarURL = require("../utils/createAvatarURL");
const createVerifyURL = require('../utils/createVerifyURL')
const fileMove = require("../utils/fileMove");

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
    verificationToken: String,
});
userSchema.statics.hashPassword = async function (password) {
    const hashedPassword = await bcrypt.hash(password, 6);
    return hashedPassword;
};
userSchema.methods.verifyPassword = async function (password) {
    const isPasswordValid = await bcrypt.compare(password, this.password);
    return isPasswordValid;
};

userSchema.methods.createJWT = async function () {
    const token = jwt.sign(
        { id: this._id, subscription: this.subscription },
        process.env.JWT_SECRET
    );
    this.token = token;
    await this.save();
};
userSchema.methods.createAvatar = async function () {
    const avatar = await generateAvatar(this.email);
    await fileMove(
        path.join(process.cwd(), "tmp", avatar),
        path.join(process.cwd(), "api/public/images", avatar)
    );
    const avatarURL = createAvatarURL(avatar);
    this.avatarURL = avatarURL;
    await this.save();
};
userSchema.methods.createAndSendVerificationEmailToken = async function(){
    const token = uuidv4()
    this.verificationToken = token
    const url = createVerifyURL(this.verificationToken)
    await sendEmail(this.email, url)
    await this.save()
}
const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
