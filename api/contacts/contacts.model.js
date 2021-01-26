const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    subscription: {
        type: String,
        enum: ["free", "pro", "premium"],
        default: "free",
    },
    password: { type: String, required: true },
    token: { type: String, default: "" },
});
ContactSchema.plugin(mongoosePaginate);

const ContactModel = mongoose.model("contact", ContactSchema);

module.exports = ContactModel;
