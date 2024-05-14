import axios from "axios";

import { createAsyncThunk } from "@reduxjs/toolkit";

const apiLogin = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + "/auth",
});

export const signinThunk = createAsyncThunk(
    "auth/signin",
    async (args: { username: string; password: string; remember: boolean }) => {
        const response = await apiLogin.post<{ tokens: { access: string; refresh: string } }>("/token/", args);
        return {
            response,
            args,
        };
    },
);

export const verifyTokenService = (token: { token: string }) => {
    const response = apiLogin.post("/token/verify/", token, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        },
    });
    return response;
};

export const refreshTokenService = (refresh: { refresh: string }) => {
    const response = apiLogin.post<{ access: string }>("/token/refresh/", refresh, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        },
    });
    return response;
};

export interface INewUser {
    username: string;
    password: string;
    email: string;
    name: string;
    last_name: string;
}

export const signupService = (user: INewUser) => {
    const response = apiLogin.post<{ msg: string }>("/signup", user);
    return response;
};
