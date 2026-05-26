const mockRefreshTokenAsync = jest.fn();
const mockGetAccessToken = jest.fn();
const mockRequest = jest.fn();

jest.mock("./auth", () => ({
    refreshTokenAsync: (...args: any[]) => mockRefreshTokenAsync(...args),
}));

jest.mock("./token", () => ({
    getAccessToken: (...args: any[]) => mockGetAccessToken(...args),
}));

jest.mock("axios", () => {
    const actual = jest.requireActual("axios");
    return {
        ...actual,
        create: jest.fn(() => ({
            get: jest.fn(),
            post: jest.fn(),
            request: (...args: any[]) => mockRequest(...args),
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

    function createAxiosError(status: number | undefined, retried = false): AxiosError {
        const config: any = { _retry: retried, url: "/test", headers: {} };
        const response = status
            ? ({
                  status,
                  data: {},
                  statusText: "Error",
                  headers: {},
                  config,
              } as AxiosResponse)
            : undefined;

        return {
            config,
            response,
            isAxiosError: true,
            name: "AxiosError",
            message: "Error",
            toJSON: () => ({}),
        } as AxiosError;
    }

    it("deve atualizar o token e reenviar a requisição quando status é 401", async () => {
        mockRefreshTokenAsync.mockResolvedValueOnce("new-access");
        mockRequest.mockResolvedValueOnce({ data: "ok" });

        const error = createAxiosError(401);
        await errorInterceptor(error);

        expect(mockRefreshTokenAsync).toHaveBeenCalledTimes(1);
        expect((error.config as any).headers.Authorization).toBe("Bearer new-access");
        expect(mockRequest).toHaveBeenCalledWith(error.config);
    });

    it("deve rejeitar quando o refresh falha em 401", async () => {
        const refreshError = new Error("Refresh failed");
        mockRefreshTokenAsync.mockRejectedValueOnce(refreshError);

        const error = createAxiosError(401);
        await expect(errorInterceptor(error)).rejects.toThrow("Refresh failed");
    });

    it("não deve tentar refresh novamente quando a requisição já foi retentada", async () => {
        const Sentry = require("@sentry/nextjs");
        const error = createAxiosError(401, true);

        await expect(errorInterceptor(error)).rejects.toBe(error);
        expect(mockRefreshTokenAsync).not.toHaveBeenCalled();
        expect(Sentry.captureException).toHaveBeenCalledWith(error);
    });

    it("não deve chamar refreshTokenAsync para status diferente de 401", async () => {
        const Sentry = require("@sentry/nextjs");
        const error = createAxiosError(500);

        await expect(errorInterceptor(error)).rejects.toBe(error);
        expect(mockRefreshTokenAsync).not.toHaveBeenCalled();
        expect(Sentry.captureException).toHaveBeenCalledWith(error);
    });

    it("deve rejeitar quando não há config", async () => {
        const error = { isAxiosError: true, name: "AxiosError", message: "Error", toJSON: () => ({}) } as AxiosError;

        await expect(errorInterceptor(error)).rejects.toBe(error);
        expect(mockRefreshTokenAsync).not.toHaveBeenCalled();
    });
});
