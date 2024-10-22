import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import TokenService from "./auth/authToken";
import * as Sentry from "@sentry/nextjs";
import { apiDjango } from "./index";

describe("apiDjango", () => {
    let mock: MockAdapter;

    beforeEach(() => {
        mock = new MockAdapter(axios);
        jest.clearAllMocks();
    });

    afterEach(() => {
        mock.restore();
    });

    test("should include Authorization header if token exists", async () => {
        const token = "test-token";
        jest.spyOn(TokenService, "getLocalAccessToken").mockReturnValue(token);

        mock.onGet("/test").reply(200);

        await apiDjango.get("/test");

        expect(mock.history.get[0].headers!.Authorization).toBe(`Bearer ${token}`);
    });

    test("should retry the request if it fails with status 500", async () => {
        const token = "test-token";
        jest.spyOn(TokenService, "getLocalAccessToken").mockReturnValue(token);
        jest.spyOn(global, "setTimeout");

        mock.onGet("/test").replyOnce(500).onGet("/test").replyOnce(200);

        await apiDjango.get("/test");

        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1500);
        expect(mock.history.get.length).toBe(2);
    });

    test("should capture exception with Sentry if request fails after retries", async () => {
        const token = "test-token";
        jest.spyOn(TokenService, "getLocalAccessToken").mockReturnValue(token);
        jest.spyOn(Sentry, "captureException");

        mock.onGet("/test").reply(500);

        try {
            await apiDjango.get("/test");
        } catch (error) {
            expect(Sentry.captureException).toHaveBeenCalledWith(error);
        }
    });
});
