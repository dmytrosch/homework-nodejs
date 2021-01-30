const supertest = require("supertest");
const Server = require("../server.js");
const UserModel = require("../users/users.model");

describe("Acceptance tests of auth endpoints", () => {
    let server;
    beforeAll(async () => {
        const _server = new Server();
        server = await _server.start();
    });
    afterAll(() => {
        server = null
    });
    describe("POST /register", () => {
        describe("when user exists", () => {
            const existingUser = "qwerty_iamhere@test.top";
            let userDoc;
            beforeAll(async () => {
                userDoc = await UserModel.create({
                    email: existingUser,
                    password: "jelloqwe_123",
                });
            });
            afterAll(async () => {
                await UserModel.findByIdAndDelete(userDoc._id);
            });
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
            const email = "qwerty_iamhere@test.top";
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
});
