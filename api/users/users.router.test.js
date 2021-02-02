const supertest = require("supertest");
const Server = require("../server.js");
const UserModel = require("../users/users.model");
const path = require("path");

describe("Acceptance tests of user endpoints", () => {
    let server;
    let userDoc;
    let token;
    beforeAll(async () => {
        require("dotenv").config();
        const _server = new Server();
        server = await _server.start();
        userDoc = await UserModel.create({
            email: "test.email@fou.ru",
            password: "jelloqwe_123",
        });
        userDoc.createJWT();
        token = userDoc.token;
    });
    afterAll(async () => {
        await UserModel.findByIdAndDelete(userDoc._id);
        await server.stop();
    });
    describe("GET /current", () => {
        describe("when auth token is invalid", () => {
            test("return 401", async () => {
                await supertest(server)
                    .get("/api/users/current")
                    .set("Content-Type", "application/json")
                    .set(
                        "Authorization",
                        "Bearer 12321321321312___INVALID_token"
                    )
                    .expect(401);
            });
        });
        describe("when auth token is valid", () => {
            test("return 200 and user object", async () => {
                const response = await supertest(server)
                    .get("/api/users/current")
                    .set("Content-Type", "application/json")
                    .set("Authorization", `Bearer ${token}`)
                    .expect(200);
                expect(response.body.email).toBe(userDoc.email);
            });
        });
    });
    describe("PATCH /avatars", () => {
        describe("when auth token is invalid", () => {
            test("return 401", async () => {
                await supertest(server)
                    .patch("/api/users/avatars")
                    .set(
                        "Authorization",
                        "Bearer 12321321321312___INVALID_token"
                    )
                    .expect(401);
            });
        });
        //NOT WORKING
        // describe("when there is no file in request", () => {
        //     test("return 400", async () => {
        //         await supertest(server)
        //             .patch("/api/users/avatars")
        //             .set("Content-Type", "multipart/form-data")
        //             .set("Authorization", `Bearer ${token}`)
        //             .field("name", "loren ipsum")
        //             .attach(
        //                 "anything",
        //                 path.join(
        //                     __dirname,
        //                     "../../images_for_tests/image-test.jpg"
        //                 )
        //             )
        //             .expect(400);
        //     });
        // });
        describe("when all success", () => {
            test("return 200 with avatar url", async () => {
                const response = await supertest(server)
                    .patch("/api/users/avatars")
                    .set("Content-Type", "multipart/form-data")
                    .set("Authorization", `Bearer ${token}`)
                    .attach(
                        "avatar",
                        path.join(
                            __dirname,
                            "../../images_for_tests/image-test.jpg"
                        )
                    )
                    .expect(200)
                    .expect("Content-Type", "application/json; charset=utf-8");
                expect(response.body).toHaveProperty("avatarURL");
                expect(userDoc).toHaveProperty("avatarURL");
            });
        });
    });
});
