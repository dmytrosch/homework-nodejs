module.exports = (token) =>
    `http://${process.env.DOMAIN}:${process.env.PORT}/api/auth/verify/${token}`;
