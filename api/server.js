const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const contactsRouter = require("./contacts/contacts.router");
const authRouter = require("./auth/auth.router");
const usersRouter = require("./users/users.router");
const path = require("path");

dotenv.config();

module.exports = class Server {
    constructor() {
        this.server = null;
        this.port = process.env.PORT || 8080;
        this.db_url = process.env.MONGO_DB_URL;
    }
    async start() {
        this.initServer();
        await this.connectToDB();
        this.initMiddlewares();
        this.initRoutes();
        this.initServerErrorHandler();
        this.startListening();
        this.initStaticMiddleware();
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
        this.server.use("/api/users", usersRouter);
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
    initStaticMiddleware() {
        this.server.use(express.static(path.join(__dirname, "./public")));
    }
};
