const { Router } = require("express");
const { gettingCurrentUser } = require("./users.controllers");
const { authorization } = require("../auth/auth.controllers");

const UsersRouter = Router();

UsersRouter.get("/current-user", authorization, gettingCurrentUser);

module.exports = UsersRouter;
