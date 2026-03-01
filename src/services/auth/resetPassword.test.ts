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

const { requestPasswordReset, validateResetToken, confirmPasswordReset } = require("./resetPassword");

beforeEach(() => {
    jest.clearAllMocks();
});

describe("requestPasswordReset", () => {
    it("deve enviar email para endpoint password-reset/request/", async () => {
        mockPost.mockResolvedValueOnce({ data: { msg: "email sent" } });

        await requestPasswordReset("user@example.com");

        expect(mockPost).toHaveBeenCalledWith("password-reset/request/", { email: "user@example.com" });
    });
});

describe("validateResetToken", () => {
    it("deve validar token via GET com params", async () => {
        mockGet.mockResolvedValueOnce({ data: { msg: "valid" } });

        await validateResetToken("abc123");

        expect(mockGet).toHaveBeenCalledWith("password-reset/validate/", {
            params: { token: "abc123" },
        });
    });
});

describe("confirmPasswordReset", () => {
    it("deve enviar token e nova senha para endpoint password-reset/confirm/", async () => {
        mockPost.mockResolvedValueOnce({ data: { msg: "password changed" } });

        await confirmPasswordReset("abc123", "newPassword123");

        expect(mockPost).toHaveBeenCalledWith("password-reset/confirm/", {
            token: "abc123",
            new_password: "newPassword123",
        });
    });
});
