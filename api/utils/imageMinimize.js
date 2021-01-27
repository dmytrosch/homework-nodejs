const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const path = require("path");

module.exports = async function (filename) {
    console.log("sourcePath", filename);
    try {
        const file = await imagemin([`tmp/${filename}`], {
            destination: path.join(__dirname, "../public/images"),
            plugins: [
                imageminJpegtran(),
                imageminPngquant({
                    quality: [0.6, 0.8],
                }),
            ],
        });
        console.log(file, "file");
    } catch (err) {
        console.log("catch err: ", err);
    }
};
