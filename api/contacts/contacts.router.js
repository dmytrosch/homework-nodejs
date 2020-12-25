const { Router } = require("express");
const {
    getAllContacts,
    getContact,
    validateNewContact,
    createContact,
    deleteContact,
    validateUpdatingContact,
    updateContact,
} = require("./contacts.controllers");

const contactsRouter = Router();

contactsRouter.get("/", getAllContacts);
contactsRouter.get("/:contactId", getContact);
contactsRouter.post("/", validateNewContact, createContact);
contactsRouter.delete("/:contactId", deleteContact);
contactsRouter.patch("/:contactId", validateUpdatingContact, updateContact);

module.exports = contactsRouter;
