const express = require("express");
const asyncWrapper = require("../utils/asyncWrapper");
const {
    register,
    credentialsValidation,
    login,
} = require("./auth.controllers");

const authRouter = express.Router();

authRouter.post("/register", credentialsValidation, asyncWrapper(register));
authRouter.post("/login", credentialsValidation, asyncWrapper(login));

module.exports = authRouter;
