export {};

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
const { refreshTokenAsync, signupService } = require("./index");
const { getAccessToken } = require("@/services/token");

describe("refreshTokenAsync", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it("deve enviar o refresh token no corpo para token/refresh/", async () => {
        localStorage.setItem("refresh_token", "refresh-123");
        mockPost.mockResolvedValueOnce({ data: { access: "new-access" } });

        await refreshTokenAsync();

        expect(mockPost).toHaveBeenCalledWith("token/refresh/", { refresh: "refresh-123" });
    });

    it("deve persistir o novo access token retornado", async () => {
        mockPost.mockResolvedValueOnce({ data: { access: "new-access" } });

        const access = await refreshTokenAsync();

        expect(access).toBe("new-access");
        expect(getAccessToken()).toBe("new-access");
    });

    it("deve disparar evento tokenRefreshFailed quando o refresh falha", async () => {
        const dispatchSpy = jest.spyOn(window, "dispatchEvent");
        mockPost.mockRejectedValueOnce({ status: 403 });

        await expect(refreshTokenAsync()).rejects.toBeDefined();

        expect(dispatchSpy).toHaveBeenCalledWith(expect.any(CustomEvent));
        const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
        expect(event.type).toBe("tokenRefreshFailed");

        dispatchSpy.mockRestore();
    });

    it("deve prevenir chamadas concorrentes retornando a mesma promise", async () => {
        let resolveFirst: (value: unknown) => void;
        const firstPromise = new Promise((r) => (resolveFirst = r));
        mockPost.mockReturnValueOnce(firstPromise);

        const call1 = refreshTokenAsync();
        const call2 = refreshTokenAsync();

        resolveFirst!({ data: { access: "new-access" } });

        await Promise.all([call1, call2]);

        expect(mockPost).toHaveBeenCalledTimes(1);
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
