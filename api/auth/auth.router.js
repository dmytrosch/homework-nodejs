const express = require("express");
const asyncWrapper = require("../utils/asyncWrapper");
const {
    register,
    credentialsValidation,
    login,
    authorization,
    gettingCurrentUser, logout
} = require("./auth.controllers");

const authRouter = express.Router();

authRouter.post("/register", credentialsValidation, asyncWrapper(register));
authRouter.post("/login", credentialsValidation, asyncWrapper(login));
authRouter.get("/current-user", authorization, gettingCurrentUser);
authRouter.delete("/logout", authorization, asyncWrapper(logout));

module.exports = authRouter;
