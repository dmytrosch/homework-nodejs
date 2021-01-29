const { changeAvatar } = require("./users.controllers");

describe("user controllers", () => {
    require("dotenv").config();
    let mRes;
    let next;
    describe("#change avatar", () => {
        beforeEach(() => {
            mRes = {
                status: jest.fn(function () {
                    return this;
                }),
                json: jest.fn(),
            };
            next = jest.fn();
        });
        test("should return 200 status", async () => {
            const mReq = {
                file: {
                    filename: "qwerty.png",
                },
                user: {
                    save: jest.fn(),
                },
            };
            await changeAvatar(mReq, mRes, next);
            expect(mRes.status).toBeCalledWith(200);
        });
    });
});
