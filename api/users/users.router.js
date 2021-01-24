const { Router } = require("express");
const {
    gettingCurrentUser,
    changeSubscription,
    validateChangingSubscription,
} = require("./users.controllers");
const authorization = require("../middlewares/authorization");
const asyncWrapper = require("../utils/asyncWrapper");

const UsersRouter = Router();

UsersRouter.get("/current", authorization, gettingCurrentUser);
UsersRouter.patch(
    "/",
    authorization,
    validateChangingSubscription,
    asyncWrapper(changeSubscription)
);

module.exports = UsersRouter;
