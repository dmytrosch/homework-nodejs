const joi = require("joi");
const bcrypt = require("bcrypt");
const UserModel = require("./auth.model");

const register = async (req, res, next) => {
    const { password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 6);
    const isUniqueEmail = !Boolean(await UserModel.findOne({ email }));
    if (!isUniqueEmail) {
        res.status(409).json({ message: "Email in use!" });
        return;
    }
    const user = await UserModel.create({
        email,
        password: hashedPassword,
    });
    const responseObject = {
        email: user.email,
        subscription: user.subscription,
    };
    res.status(201).json({ user: responseObject });
};

const registerValidation = (req, res, next) => {
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

module.exports = { register, registerValidation };
