const joi = require("joi");
const UserModel = require("../users/users.model");
const UserBodyResponse = require("../utils/UserBodyResponseConstructor");

const register = async (req, res, next) => {
    const { password, email } = req.body;
    const hashedPassword = await UserModel.hashPassword(password);
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        res.status(409).json({ message: "Email in use!" });
        return;
    }
    const user = await UserModel.create({
        email,
        password: hashedPassword,
    });
    await user.createAvatar()
    res.status(201).json({ user: new UserBodyResponse(user) });
};
const login = async (req, res, next) => {
    const { password, email } = req.body;
    const user = await UserModel.findOne({ email });
    function failAuth() {
        return res.status(401).json({ message: "Email or password is wrong" });
    }
    if (!user) {
        failAuth();
        return;
    }
    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
        failAuth();
        return;
    }
    user.createJWT();
    res.status(200).json({
        token: user.token,
        user: new UserBodyResponse(user),
    });
};
const logout = async (req, res, next) => {
    req.user.token = "";
    await req.user.save();
    res.sendStatus(204);
};

const credentialsValidation = (req, res, next) => {
    const validationSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(7).required(),
    });
    const validation = validationSchema.validate(req.body);
    if (validation.error) {
        res.status(400).json(validation.error);
        return;
    }
    next();
};

module.exports = {
    register,
    credentialsValidation,
    login,
    logout,
};
