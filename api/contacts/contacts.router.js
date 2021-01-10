const { Router } = require("express");
const asyncWrapper = require("../utils/asyncWrapper");
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

contactsRouter.get("/", asyncWrapper(getAllContacts));
contactsRouter.get("/:contactId", asyncWrapper(getContact));
contactsRouter.post("/", validateNewContact, asyncWrapper(createContact));
contactsRouter.delete("/:contactId", asyncWrapper(deleteContact));
contactsRouter.patch(
    "/:contactId",
    validateUpdatingContact,
    asyncWrapper(updateContact)
);

module.exports = contactsRouter;
