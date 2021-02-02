const supertest = require("supertest");
const Server = require("../server.js");
const UserModel = require("../users/users.model");
const { v4: uuidv4 } = require("uuid");

describe("Acceptance tests of auth endpoints", () => {
    let server;
    let userDoc;
    beforeAll(async () => {
        const _server = new Server();
        server = await _server.start();
        const existingUser = "qwerty_iamhere@test.top";
        userDoc = await UserModel.create({
            email: existingUser,
            password: "jelloqwe_123",
            verificationToken: uuidv4(),
        });
    });
    afterAll(async () => {
        await UserModel.findByIdAndDelete(userDoc._id);
        await server.stop();
    });
    describe("POST /register", () => {
        describe("when user exists", () => {
            test("return 409", async () => {
                await supertest(server)
                    .post("/api/auth/register")
                    .set("Content-Type", "application/json")
                    .send({
                        email: userDoc.email,
                        password: userDoc.password,
                    })
                    .expect(409);
            });
        });
        describe("when invalid email", () => {
            test("return 400", async () => {
                await supertest(server)
                    .post("/api/auth/register")
                    .set("Content-Type", "application/json")
                    .send({
                        email: "no_email_string",
                        password: "javascriptisthebest",
                    })
                    .expect(400);
            });
        });
        describe("when everything is fine", () => {
            const email = "qwerty_iamhere2@test.top";
            test("return 201", async () => {
                const response = await supertest(server)
                    .post("/api/auth/register")
                    .set("Content-Type", "application/json")
                    .send({
                        email: email,
                        password: "javascriptisthebest",
                    })
                    .expect(201);
                expect(response.body.user).toHaveProperty("email");
                const user = await UserModel.findOne({ email });
                expect(user).toBeTruthy();
            });
            afterAll(async () => {
                await UserModel.findOneAndDelete({ email });
            });
        });
    });
    describe("GET /verify", () => {
        describe("when there is no user with such token", () => {
            test("should return 404", async () => {
                const wrongToken = uuidv4();
                await supertest(server)
                    .get(`/api/auth/verify/${wrongToken}`)
                    .send()
                    .expect(404);
            });
        });
        describe("when user has token", () => {
            test("should return 200", async () => {
                await supertest(server)
                    .get(`/api/auth/verify/${userDoc.verificationToken}`)
                    .send()
                    .expect(200);
            });
        });
    });
});
