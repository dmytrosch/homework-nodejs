module.exports = (filename) =>
    `http://${process.env.DOMAIN}:${process.env.PORT}/images/${filename}`;
