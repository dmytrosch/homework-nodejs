const express = require("express");
const asyncWrapper = require("../utils/asyncWrapper");
const { register, registerValidation } = require("./auth.controllers");

const authRouter = express.Router();

authRouter.post("/register", registerValidation, asyncWrapper(register));

module.exports = authRouter;
