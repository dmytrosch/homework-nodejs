const path = require("path");
const fsPromises = require("fs").promises;

const contactsPath = path.join(__dirname, "./db/contacts.json");

function rewriteContactList(newData) {
    fsPromises.writeFile(contactsPath, JSON.stringify(newData), "utf-8");
}
function createUniqueId(array) {
    const arrayOfId = array.map((contact) => Number(contact.id));
    return Math.max(...arrayOfId) + 1;
}

async function listContacts() {
    const contactsList = await fsPromises.readFile(contactsPath, "utf-8");
    return JSON.parse(contactsList);
}

async function getContactById(contactId) {
    const contactsList = await listContacts();
    const contact = contactsList.find((contact) => contact.id == contactId);
    return contact;
}

async function removeContact(contactId) {
    const contactsList = await listContacts();
    const newList = contactsList.filter((contact) => contact.id != contactId);
    rewriteContactList(newList);
    return newList;
}

async function addContact(name, email, phone) {
    const contactsList = await listContacts();
    const newObject = {
        id: createUniqueId(contactsList),
        name,
        email,
        phone,
    };
    const newList = [...contactsList, newObject];
    rewriteContactList(newList);
    return newObject;
}

async function updateContact(id, fieldsToPatch) {
    const contact = Boolean(await getContactById(id));
    if (contact) {
        let updatedContact = null;
        const contactsList = await listContacts();
        const newList = contactsList.map((item) => {
            if (item.id == id) {
                updatedContact = { ...item, ...fieldsToPatch };
                return updatedContact;
            } else {
                return item;
            }
        });
        rewriteContactList(newList);
        return updatedContact;
    } else {
        return undefined;
    }
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
};
