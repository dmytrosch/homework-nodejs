const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const path = require("path");

module.exports = async function () {
    const file = await imagemin(
        ["../../tmp/*.{jpg,png}"],
        {
            destination: 'api/public/images',
            plugins: [
                imageminJpegtran(),
                imageminPngquant({
                    quality: [0.6, 0.8],
                }),
            ],
        }
    );
    console.log(file, 'file');
};
