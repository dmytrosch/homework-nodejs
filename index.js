const contactsMethods = require("./contacts");
const argv = require("yargs").argv;

function invokeAction({ action, id, name, email, phone }) {
    switch (action) {
        case "list":
            contactsMethods.listContacts().then(console.table);
            break;

        case "get":
            contactsMethods.getContactById(id).then(console.log);
            break;

        case "add":
            contactsMethods.addContact(name, email, phone).then(console.table);
            break;

        case "remove":
            contactsMethods.removeContact(id).then(console.table);
            break;

        default:
            console.warn("\x1B[31m Unknown action type!");
    }
}

invokeAction(argv);
