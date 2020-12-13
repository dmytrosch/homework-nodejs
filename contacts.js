const path = require("path");
const fsPromises = require("fs").promises;
const uuid4 = require("uuid4");

const contactsPath = path.resolve("./db/contacts.json");

function rewriteContactList(newData) {
    fsPromises.writeFile(contactsPath, JSON.stringify(newData), "utf-8");
}

async function listContacts() {
    const contactsList = await fsPromises.readFile(contactsPath, "utf-8");
    return JSON.parse(contactsList);
}

async function getContactById(contactId) {
    const contactsList = await listContacts();
    const contact = contactsList.find((contact) => contact.id === contactId);
    return contact;
}

async function removeContact(contactId) {
    const contactsList = await listContacts();
    const newList = contactsList.filter((contact) => contact.id !== contactId);
    rewriteContactList(newList);
    return newList
}

async function addContact(name, email, phone) {
    const newObject = {
        id: uuid4(),
        name,
        email,
        phone,
    };
    const contactsList = await listContacts();
    const newList = [...contactsList, newObject];
    rewriteContactList(newList);
    return newList
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
};
