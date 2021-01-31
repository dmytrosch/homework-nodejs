const UserModel = require("../users/users.model");
const authorization = require("./authorization");

describe("#authorization middleware", () => {
    require("dotenv").config();
    let mRes;
    const next = jest.fn();
    beforeEach(() => {
        mRes = {
            status: jest.fn(function () {
                return this;
            }),
            json: jest.fn(),
        };
        jest.spyOn(UserModel, "findById").mockResolvedValueOnce({
            _id: "6007431b626eff215cf66caa",
            subscription: "free",
            token:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMDc0MzFiNjI2ZWZmMjE1Y2Y2NmNhYSIsInN1YnNjcmlwdGlvbiI6ImZyZWUiLCJpYXQiOjE2MTE3NjU1MDl9.9R2kBDOnHz7tl9RWn7Qz6_lX1Ss9ftdFRvh9HDfsWFY",
            email: "user2@ggf.ru",
            password:
                "$2b$06$LNiDZSZooWMN7tB42euZIeCtca2BOUqH1ygiTN0R3FnKp5R/zO0AO",
            __v: 0,
            avatarURL: "http://localhost:8080/images/1611768560484_avatar.png",
        });
    });
    test("success. should call next fn", async () => {
        const mReq = {
            get: jest.fn(
                () =>
                    "Baerer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMDc0MzFiNjI2ZWZmMjE1Y2Y2NmNhYSIsInN1YnNjcmlwdGlvbiI6ImZyZWUiLCJpYXQiOjE2MTE3NjU1MDl9.9R2kBDOnHz7tl9RWn7Qz6_lX1Ss9ftdFRvh9HDfsWFY"
            ),
        };
        await authorization(mReq, mRes, next);
        expect(next).toBeCalled();
    });
    test("error. w/o jwt in header. should return 401 response", async () => {
        const mReq = {
            get: jest.fn(() => null),
        };
        await authorization(mReq, mRes, next);
        expect(mRes.status).toBeCalledWith(401);
    });
    test('error. invlid token in header. should return 401 response', async () => {
        const mReq = {
            get: jest.fn(() => "Baerer eyJhbG74457&&&&&&zI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMDc0MzFiNjI2ZWZmMjE1Y2Y2NmNhYSIsInN1YnNjcmlwdGlvbiI6ImZyZWUiLCJpYXQiOjE2MTE3NjU1MDl9.9R2kBDOnHz7tl9RWn7Qz6_lX1Ss9ftdFRvh9HDfsWFY"),
        };
        await authorization(mReq, mRes, next);
        expect(mRes.status).toBeCalledWith(401);
    });
    
});
