const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: path.join(__dirname, "../../tmp/"),
    filename: function (req, file, cb) {
        const ext = path.parse(file.originalname).ext;
        cb(null, `${Date.now()}_avatar${ext}`);
    },
});

const upload = multer({ storage });

module.exports = upload;
