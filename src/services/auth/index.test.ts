import { HttpStatusCode } from "axios";

const mockPost = jest.fn();
const mockGet = jest.fn();

jest.mock("axios", () => ({
    create: jest.fn(() => ({
        post: mockPost,
        get: mockGet,
        interceptors: {
            request: { use: jest.fn() },
            response: { use: jest.fn() },
        },
    })),
    HttpStatusCode: { Forbidden: 403, Unauthorized: 401 },
}));

// Import after mock setup
const { refreshTokenAsync, signupService, refreshTokenService, apiAuth } = require("./index");

describe("refreshTokenAsync", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve chamar endpoint token/refresh/", async () => {
        mockPost.mockResolvedValueOnce({ status: 200, data: { msg: "ok" } });

        await refreshTokenAsync();

        expect(mockPost).toHaveBeenCalledWith("token/refresh/");
    });

    it("deve rejeitar quando o status não é 200", async () => {
        mockPost.mockResolvedValueOnce({ status: 400, data: { msg: "error" } });

        await expect(refreshTokenAsync()).rejects.toThrow("Falha ao atualizar o token");
    });

    it("deve disparar evento tokenRefreshFailed quando recebe erro com status 403", async () => {
        const dispatchSpy = jest.spyOn(window, "dispatchEvent");
        mockPost.mockRejectedValueOnce({ status: 403 });

        await expect(refreshTokenAsync()).rejects.toBeDefined();

        expect(dispatchSpy).toHaveBeenCalledWith(expect.any(CustomEvent));
        const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
        expect(event.type).toBe("tokenRefreshFailed");

        dispatchSpy.mockRestore();
    });

    it("deve prevenir chamadas concorrentes retornando a mesma promise", async () => {
        let resolveFirst: Function;
        const firstPromise = new Promise((r) => (resolveFirst = r));
        mockPost.mockReturnValueOnce(firstPromise);

        const call1 = refreshTokenAsync();
        const call2 = refreshTokenAsync();

        resolveFirst!({ status: 200, data: { msg: "ok" } });

        await Promise.all([call1, call2]);

        expect(mockPost).toHaveBeenCalledTimes(1);
    });
});

describe("refreshTokenService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve chamar apiAuth.post com endpoint token/refresh/", async () => {
        mockPost.mockResolvedValueOnce({ data: { msg: "refreshed" } });

        const result = await refreshTokenService();

        expect(mockPost).toHaveBeenCalledWith("token/refresh/");
        expect(result.data.msg).toBe("refreshed");
    });
});

describe("signupService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve enviar POST com dados do novo usuário para endpoint signup", async () => {
        const newUser = {
            username: "testuser",
            password: "password123",
            email: "test@example.com",
            name: "Test",
            last_name: "User",
        };
        mockPost.mockResolvedValueOnce({ data: { msg: "created" } });

        await signupService(newUser);

        expect(mockPost).toHaveBeenCalledWith("signup", newUser);
    });
});
