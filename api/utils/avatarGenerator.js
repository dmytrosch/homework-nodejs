const path = require("path");

const AvatarGenerator = require("avatar-generator");

module.exports = async function (email) {
    const avatar = new AvatarGenerator({
        //All settings are optional.
        parts: [
            "background",
            "face",
            "clothes",
            "head",
            "hair",
            "eye",
            "mouth",
        ], //order in which sprites should be combined
        imageExtension: ".png", // sprite file extension
    });
    const variant = "male"; // By default 'male' and 'female' supported
    const image = await avatar.generate(email, variant);
    const filename = `avatar_${email}_${Date.now()}`;
    image.png().toFile(`tmp/${filename}.png`);
    return filename;
};
// Now `image` contains sharp image pipeline http://sharp.pixelplumbing.com/en/stable/api-output/
// you can write it to file
