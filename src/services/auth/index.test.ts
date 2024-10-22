import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { signinThunk, verifyTokenService, refreshTokenService, signupService, INewUser } from "./index";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Auth Services", () => {
    describe("signinThunk", () => {
        test("should handle successful signin", async () => {
            const mockResponse = { data: { tokens: { access: "access_token", refresh: "refresh_token" } } };
            mockedAxios.post.mockResolvedValueOnce(mockResponse);

            const args = { username: "testuser", password: "password", remember: true };
            const result = await signinThunk(args, {
                dispatch: jest.fn(),
                getState: jest.fn(),
                extra: undefined,
                requestId: "",
                signal: new AbortController().signal,
            });

            expect(result.payload).toEqual({ response: mockResponse.data, args });
            expect(mockedAxios.post).toHaveBeenCalledWith("/token/", args);
        });
    });

    describe("verifyTokenService", () => {
        test("should verify token successfully", async () => {
            const mockResponse = { data: {} };
            mockedAxios.post.mockResolvedValueOnce(mockResponse);

            const token = { token: "valid_token" };
            const response = await verifyTokenService(token);

            expect(response).toEqual(mockResponse);
            expect(mockedAxios.post).toHaveBeenCalledWith("/token/verify/", token, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                },
            });
        });
    });

    describe("refreshTokenService", () => {
        test("should refresh token successfully", async () => {
            const mockResponse = { data: { access: "new_access_token" } };
            mockedAxios.post.mockResolvedValueOnce(mockResponse);

            const refresh = { refresh: "refresh_token" };
            const response = await refreshTokenService(refresh);

            expect(response).toEqual(mockResponse);
            expect(mockedAxios.post).toHaveBeenCalledWith("/token/refresh/", refresh, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                },
            });
        });
    });

    describe("signupService", () => {
        test("should signup successfully", async () => {
            const mockResponse = { data: { msg: "User created successfully" } };
            mockedAxios.post.mockResolvedValueOnce(mockResponse);

            const newUser: INewUser = {
                username: "newuser",
                password: "password",
                email: "newuser@example.com",
                name: "New",
                last_name: "User",
            };
            const response = await signupService(newUser);

            expect(response).toEqual(mockResponse);
            expect(mockedAxios.post).toHaveBeenCalledWith("/signup", newUser);
        });
    });
});
