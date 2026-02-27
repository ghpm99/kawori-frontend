import { errorInterceptor } from "./index";

jest.mock("@sentry/nextjs");
jest.mock("./auth", () => ({
    refreshTokenAsync: jest.fn().mockResolvedValue(undefined),
}));

describe("apiDjango", () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const makeErrorRequest = (codeStatus: number, retryCount = 0) => ({
        message: `Request failed with status code ${codeStatus}`,
        name: "AxiosError",
        isAxiosError: true,
        toJSON: jest.fn(),
        config: {
            _retryCount: retryCount,
            baseURL: "http://localhost:8500/",
            method: "get",
            url: "/profile/",
            headers: {
                Accept: "application/json, text/plain, */*",
                Authorization: "Bearer",
            },
        },
        response: {
            data: { msg: "O token é inválido ou expirado" },
            status: codeStatus,
            statusText: "Error",
            headers: {},
            config: {},
        },
    });

    test.each([408, 504, 500])(
        "should schedule a retry for status %s",
        (codeStatus) => {
            const errorRequest = makeErrorRequest(codeStatus);
            const result = errorInterceptor(errorRequest as any);
            expect(result).toBeInstanceOf(Promise);
        },
    );

    test("should reject and capture exception when max retries are exceeded", async () => {
        const Sentry = jest.requireMock("@sentry/nextjs");
        const errorRequest = makeErrorRequest(500, 3);

        await expect(errorInterceptor(errorRequest as any)).rejects.toBeDefined();
        expect(Sentry.captureException).toHaveBeenCalled();
    });
});
