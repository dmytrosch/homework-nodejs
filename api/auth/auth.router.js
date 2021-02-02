const express = require("express");
const asyncWrapper = require("../utils/asyncWrapper");
const {
    register,
    credentialsValidation,
    login,
    logout,
    verifyEmailByToken,
} = require("./auth.controllers");
const authorization = require("../middlewares/authorization");

const authRouter = express.Router();

authRouter.post("/register", credentialsValidation, asyncWrapper(register));
authRouter.post("/login", credentialsValidation, asyncWrapper(login));
authRouter.delete("/logout", authorization, asyncWrapper(logout));
authRouter.get("/verify/:verificationToken", asyncWrapper(verifyEmailByToken));

module.exports = authRouter;
