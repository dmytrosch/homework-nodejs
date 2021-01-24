const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        failAuth();
        return;
    }
    const token = jwt.sign(
        { id: user._id, subscription: user.subscription },
        process.env.JWT_SECRET
    );
    user.token = token;
    user.save();
    res.status(200).json({ token, user: new UserBodyResponse(user) });
};
const authorization = async (req, res, next) => {
    try {
        const authorizationHeader = req.get("Authorization");
        const [_, token] = authorizationHeader.split(" ");
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(payload.id);
        if (!user) {
            throw new Error();
        }
        req.user = user;
        next();
    } catch {
        res.status(401).json({ message: "Not authorized" });
    }
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
    authorization,
    logout,
};
