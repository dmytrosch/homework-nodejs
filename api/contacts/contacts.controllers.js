const contactsMethods = require("./contacts.utils");
const joi = require("joi");

const contactsControllers = {
    async getAllContacts(req, res) {
        try {
            const contactsToSend = await contactsMethods.listContacts();
            res.status(200).json(contactsToSend);
        } catch {
            res.status(500).json({ message: "Problems with server" });
        }
    },
    async getContact(req, res) {
        try {
            const contactToSend = await contactsMethods.getContactById(
                req.params.contactId
            );
            if (!contactToSend) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(200).json(contactToSend);
        } catch {
            res.status(500).json({ message: "Problems with server" });
        }
    },
    async createContact(req, res) {
        const { name, email, phone } = req.body;
        try {
            const newContact = await contactsMethods.addContact(
                name,
                email,
                phone
            );
            res.status(201).json(newContact);
        } catch {
            res.status(500).json({ message: "Problems with server" });
        }
    },
    async deleteContact(req, res) {
        try {
            const contactToRemove = await contactsMethods.getContactById(
                req.params.contactId
            );
            if (!contactToRemove) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            await contactsMethods.removeContact(req.params.contactId);
            res.status(200).json({ message: "contact deleted" });
        } catch {
            res.status(500).json({ message: "Problems with server" });
        }
    },
    async updateContact(req, res) {
        const requestBody = req.body;
        try {
            const contactToEdit = await contactsMethods.updateContact(
                req.params.contactId,
                requestBody
            );
            if (!contactToEdit) {
                res.status(404).json({ message: "user not found" });
                return;
            }
            res.status(200).json(contactToEdit);
        } catch {
            res.status(500).json({ message: "Problems with server" });
        }
    },
    validateNewContact(req, res, next) {
        const validationRules = joi.object({
            name: joi.string().required(),
            email: joi.string().email().required(),
            phone: joi.string().required(),
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
