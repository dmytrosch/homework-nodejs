const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const contactsRouter = require("./contacts/contacts.router");
const authRouter = require("./auth/auth.router");

dotenv.config();

module.exports = class Server {
    constructor() {
        this.server = null;
        this.port = process.env.PORT || 8080;
        this.db_url = process.env.MONGO_DB_URL;
    }
    start() {
        this.initServer();
        this.connectToDB();
        this.initMiddlewares();
        this.initRoutes();
        this.initServerErrorHandler();
        this.startListening();
    }
    initServer() {
        this.server = express();
    }
    async connectToDB() {
        try {
            await mongoose.connect(this.db_url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true,
            });
            console.log("Database connection successful");
        } catch (err) {
            process.exit(1);
        }
    }
    initMiddlewares() {
        this.server.use(cors());
        this.server.use(express.json());
        this.server.use(morgan("dev"));
    }
    initRoutes() {
        this.server.use("/api/contacts", contactsRouter);
        this.server.use("/api/auth", authRouter);
    }
    startListening() {
        this.server.listen(this.port, () =>
            console.log("server started on port ", this.port)
        );
    }
    initServerErrorHandler() {
        this.server.use((error, req, res, next) => {
            res.status(500).json({ message: error.message });
        });
    }
};
