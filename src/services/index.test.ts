const mockRefreshTokenAsync = jest.fn();

jest.mock("./auth", () => ({
    refreshTokenAsync: (...args: any[]) => mockRefreshTokenAsync(...args),
}));

jest.mock("axios", () => {
    const actual = jest.requireActual("axios");
    return {
        ...actual,
        create: jest.fn(() => ({
            get: jest.fn(),
            post: jest.fn(),
            interceptors: {
                request: { use: jest.fn() },
                response: { use: jest.fn() },
            },
        })),
    };
});

import { AxiosError, AxiosResponse } from "axios";
import { errorInterceptor } from "./index";

describe("errorInterceptor", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    function createAxiosError(status: number | undefined, retryCount = 0): AxiosError {
        const config: any = { _retryCount: retryCount, url: "/test" };
        const response = status ? {
            status,
            data: {},
            statusText: "Error",
            headers: {},
            config,
        } as AxiosResponse : undefined;

        return {
            config,
            response,
            isAxiosError: true,
            name: "AxiosError",
            message: "Error",
            toJSON: () => ({}),
        } as AxiosError;
    }

    it("deve chamar refreshTokenAsync quando status é 401", async () => {
        mockRefreshTokenAsync.mockResolvedValueOnce(undefined);

        const error = createAxiosError(401);
        errorInterceptor(error);

        expect(mockRefreshTokenAsync).toHaveBeenCalledTimes(1);
    });

    it("deve rejeitar quando refreshToken falha em 401", async () => {
        const refreshError = new Error("Refresh failed");
        mockRefreshTokenAsync.mockRejectedValueOnce(refreshError);

        const error = createAxiosError(401);
        await expect(errorInterceptor(error)).rejects.toThrow("Refresh failed");
    });

    it("deve incrementar retryCount a cada tentativa", () => {
        const error = createAxiosError(500);
        errorInterceptor(error);

        expect((error.config as any)._retryCount).toBe(1);
    });

    it("deve rejeitar e reportar ao Sentry após 3 tentativas", async () => {
        const Sentry = require("@sentry/nextjs");
        const error = createAxiosError(500, 3);

        await expect(errorInterceptor(error)).rejects.toBe(error);
        expect(Sentry.captureException).toHaveBeenCalledWith(error);
    });

    it("deve fazer retry para status 408 (timeout)", () => {
        const error = createAxiosError(408);
        errorInterceptor(error);

        expect((error.config as any)._retryCount).toBe(1);
    });

    it("deve fazer retry para status 504 (gateway timeout)", () => {
        const error = createAxiosError(504);
        errorInterceptor(error);

        expect((error.config as any)._retryCount).toBe(1);
    });

    it("deve fazer retry quando response é undefined (erro de rede)", () => {
        const error = createAxiosError(undefined);
        errorInterceptor(error);

        expect((error.config as any)._retryCount).toBe(1);
    });

    it("não deve chamar refreshTokenAsync para status diferente de 401", () => {
        const error = createAxiosError(500);
        errorInterceptor(error);

        expect(mockRefreshTokenAsync).not.toHaveBeenCalled();
    });
});
