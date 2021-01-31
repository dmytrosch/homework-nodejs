const { Router } = require("express");
const upload = require('../utils/multer.config')
const {
    gettingCurrentUser,
    changeSubscription,
    validateChangingSubscription,
    changeAvatar,
} = require("./users.controllers");
const authorization = require("../middlewares/authorization");
const asyncWrapper = require("../utils/asyncWrapper");

const UsersRouter = Router();

UsersRouter.get("/current", authorization, gettingCurrentUser);
UsersRouter.patch(
    "/avatars",
    authorization,
    upload.single("avatar"),
    asyncWrapper(changeAvatar)
);
UsersRouter.patch(
    "/",
    authorization,
    validateChangingSubscription,
    asyncWrapper(changeSubscription)
);

module.exports = UsersRouter;
