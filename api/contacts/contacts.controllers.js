const ContactsModel = require("./contacts.model");
const joi = require("joi");

const contactsControllers = {
    async getAllContacts(req, res) {
        const { limit = 20, page = 1, sub } = req.query;
        const paginateOptions = { page, limit };
        const contacts = await ContactsModel.paginate(
            { subscription: sub },
            paginateOptions
        );
        res.status(200).json(contacts);
    },
    async getContact(req, res) {
        const contactToSend = await ContactsModel.findById(
            req.params.contactId
        );
        if (!contactToSend) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(contactToSend);
    },
    async createContact(req, res) {
        const newContact = await ContactsModel.create(req.body);
        res.status(201).json(newContact);
    },
    async deleteContact(req, res) {
        const contactToRemove = await ContactsModel.findByIdAndDelete(
            req.params.contactId
        );
        if (!contactToRemove) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ message: "contact deleted" });
    },
    async updateContact(req, res) {
        const requestBody = req.body;
        const contactToEdit = await ContactsModel.findByIdAndUpdate(
            req.params.contactId,
            { $set: requestBody },
            { new: true }
        );
        if (!contactToEdit) {
            res.status(404).json({ message: "user not found" });
            return;
        }
        res.status(200).json(contactToEdit);
    },
    validateNewContact(req, res, next) {
        const validationRules = joi.object({
            name: joi.string().required(),
            email: joi.string().email().required(),
            phone: joi.string().required(),
            subscription: joi.string().valid("free", "pro", "premium"),
            password: joi.string().required(),
            token: joi.string(),
        });
        const validation = validationRules.validate(req.body);
        if (validation.error) {
            res.status(400).json(validation.error);
            return;
        }
        next();
    },
    validateUpdatingContact(req, res, next) {
        const requestBody = req.body;
        if (Object.keys(requestBody).length === 0) {
            res.status(400).json({ message: "missing fields" });
            return;
        }
        const validationRules = joi.object({
            name: joi.string(),
            email: joi.string().email(),
            phone: joi.string(),
            subscription: joi.string().valid("free", "pro", "premium"),
            password: joi.string(),
            token: joi.string(),
        });
        const validation = validationRules.validate(requestBody);
        if (validation.error) {
            res.status(400).json(validation.error);
            return;
        }
        next();
    },
};

module.exports = contactsControllers;
