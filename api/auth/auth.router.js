const express = require("express");
const asyncWrapper = require("../utils/asyncWrapper");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const {
    register,
    credentialsValidation,
    login,
    logout,
} = require("./auth.controllers");
const authorization = require('../middlewares/authorization')

const authRouter = express.Router();

authRouter.post("/register", credentialsValidation, asyncWrapper(register));
authRouter.post("/login", credentialsValidation, asyncWrapper(login));
authRouter.delete("/logout", authorization, asyncWrapper(logout));

module.exports = authRouter;
