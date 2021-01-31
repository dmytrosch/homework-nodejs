const UsersModel = require("./users.model");
const UserBodyResponse = require("../utils/UserBodyResponseConstructor");
const joi = require("joi");
const imageMinimize = require("../utils/imageMinimize");

const gettingCurrentUser = (req, res, next) => {
    res.status(200).json(new UserBodyResponse(req.user));
};
const changeSubscription = async (req, res, next) => {
    req.user.subscription = req.body.subscription;
    await req.user.save();
    res.status(200).json({
        message: `Subscription updated to ${req.user.subscription}`,
    });
};
const validateChangingSubscription = (req, res, next) => {
    const validationSchema = joi.object({
        subscription: joi.string().valid("free", "pro", "premium").required(),
    });
    const validation = validationSchema.validate(req.body);
    if (validation.error) {
        res.status(400).json(validation.error);
        return;
    }
    next();
};
const changeAvatar = async (req, res, next) => {
    if (!req.file) {
        res.status(400).json({ message: "Request doesn't contain any files" });
        return;
    }
    const { filename } = req.file;
    const { user } = req;
    const avatarURL = await imageMinimize(filename);
    user.avatarURL = avatarURL;
    await user.save();
    res.status(200).json({ avatarURL });
};

module.exports = {
    gettingCurrentUser,
    changeSubscription,
    validateChangingSubscription,
    changeAvatar,
};
