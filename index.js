const contactsMethods = require("./contacts");
// const argv = require("yargs").argv;
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const joi = require("joi");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/contacts", async (req, res) => {
    try {
        const contactsToSend = await contactsMethods.listContacts();
        res.json(contactsToSend);
    } catch {
        res.status(500).json({ message: "Problems with server" });
    }
});
app.get("/api/contacts/:contactId", async (req, res) => {
    try {
        const contactToSend = await contactsMethods.getContactById(
            req.params.contactId
        );
        if (contactToSend) {
            res.json(contactToSend);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch {
        res.status(500).json({ message: "Problems with server" });
    }
});
app.post("/api/contacts", async (req, res) => {
    const validationRules = joi.object({
        name: joi.string().required(),
        email: joi.string().required(),
        phone: joi.string().required(),
    });
    const validation = validationRules.validate(req.body);
    if (validation.error) {
        res.status(400).json(validation.error);
        return;
    }
    const { name, email, phone } = req.body;
    try {
        const newContact = await contactsMethods.addContact(name, email, phone);
        res.status(201).json(newContact);
    } catch {
        res.status(500).json({ message: "Problems with server" });
    }
});
app.delete("/api/contacts/:contactId", async (req, res) => {
    try {
        const contactToRemove = await contactsMethods.getContactById(
            req.params.contactId
        );
        if (contactToRemove) {
            await contactsMethods.removeContact(req.params.contactId);
            res.status(200).json({ message: "contact deleted" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch {
        res.status(500).json({ message: "Problems with server" });
    }
});
app.patch("/api/contacts/:contactId", async (req, res) => {
    const requestBody = req.body;
    if (Object.keys(requestBody).length === 0) {
        res.status(400).json({ message: "missing fields" });
        return;
    }
    const validationRules = joi.object({
        name: joi.string(),
        email: joi.string(),
        phone: joi.string(),
    });
    const validation = validationRules.validate(requestBody);
    if (validation.error) {
        res.status(400).json({ message: "unexpected field" });
        return;
    }
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
});

app.listen(port, () => {
    console.log("server started on port ", port);
});

// function invokeAction({ action, id, name, email, phone }) {
//     switch (action) {
//         case "list":
//             contactsMethods.listContacts().then(console.table);
//             break;

//         case "get":
//             contactsMethods.getContactById(id).then(console.log);
//             break;

//         case "add":
//             contactsMethods.addContact(name, email, phone).then(console.table);
//             break;

//         case "remove":
//             contactsMethods.removeContact(id).then(console.table);
//             break;

//         default:
//             console.warn("\x1B[31m Unknown action type!");
//     }
// }

// invokeAction(argv);
