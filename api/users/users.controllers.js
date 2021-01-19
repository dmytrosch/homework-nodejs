const UsersModel = require("./users.model");
const UserBodyResponse = require("../utils/UserBodyResponseConstructor");

const gettingCurrentUser = (req, res, next) => {
    res.status(200).json(new UserBodyResponse(req.user));
};

module.exports = { gettingCurrentUser };
