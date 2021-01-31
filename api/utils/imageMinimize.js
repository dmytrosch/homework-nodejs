const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const path = require("path");
const getAvatarUrl = require("./createAvatarURL");

module.exports = async function (filename) {
    try {
        await imagemin([`tmp/${filename}`], {
            destination: path.join(__dirname, "../public/images"),
            plugins: [
                imageminJpegtran(),
                imageminPngquant({
                    quality: [0.6, 0.8],
                }),
            ],
        });
        return getAvatarUrl(filename);
    } catch (err) {
        throw new Error(err);
    }
};
