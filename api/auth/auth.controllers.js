const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("./auth.model");

function UserBodyResponse({ email, subscription }) {
    this.email = email;
    this.subscription = subscription;
}

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
    user.token = token
    user.save();
    res.status(200).json({ token, user: new UserBodyResponse(user) });
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

module.exports = { register, credentialsValidation, login };
