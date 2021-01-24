const jwt = require("jsonwebtoken");
const UserModel = require("../users/users.model");

const authorization = async (req, res, next) => {
    try {
        const authorizationHeader = req.get("Authorization");
        const [_, token] = authorizationHeader.split(" ");
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(payload.id);
        if (!user) {
            throw new Error();
        }
        req.user = user;
        next();
    } catch {
        res.status(401).json({ message: "Not authorized" });
    }
};

module.exports = authorization;
