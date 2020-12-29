const mongoose = require("mongoose");
const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    subscription: {
        type: String,
        enum: ["free", "pro", "premium"],
    },
    password: { type: String, required: true },
    token: { type: String, required: false, default: "" },
});
const ContactModel = mongoose.model("contacts", ContactSchema);

module.exports = ContactModel;
