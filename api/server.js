const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const contactsRouter = require('./contacts/contacts.router')

dotenv.config();

module.exports = class UsersServer {
    constructor() {
        this.server = null;
        this.port = process.env.PORT || 8080;
    }
    start() {
        this.initServer();
        this.initMiddlewares();
        this.initRoutes();
        this.startListening();
    }
    initServer() {
        this.server = express();
    }
    initMiddlewares() {
        this.server.use(cors());
        this.server.use(express.json());
        this.server.use(morgan("dev"));
    }
    initRoutes() {
        this.server.use('/api/contacts', contactsRouter)
    }
    startListening() {
        this.server.listen(this.port, () =>
            console.log("server started on port ", this.port)
        );
    }
};
