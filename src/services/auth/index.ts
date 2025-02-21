import axios from "axios"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { apiDjango } from ".."

const apiLogin = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + "/auth",
    withCredentials: true,
    headers: {
        "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_API_URL,
        "Content-Type": "application/json",
    },
});

export const signinThunk = createAsyncThunk(
    "auth/signin",
    (args: { username: string; password: string; remember: boolean }) => {
        apiDjango.post<{ msg: string }>("auth/token/", args);
    },
);

export const userDetailThunk = createAsyncThunk("profile/userDetail", async () => {
    const response = await apiDjango.get<{
        id: number;
        name: string;
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        is_staff: boolean;
        is_active: boolean;
        is_superuser: boolean;
        last_login: string | null;
        date_joined: string;
    }>("profile/");
    return response.data;
});

export const verifyTokenThunk = createAsyncThunk("auth/verify", async () => {
    const response = apiDjango.post("auth/token/verify/");
    return response;
});

export const refreshTokenService = (refresh: { refresh: string }) => {
    const response = apiDjango.post<{ access: string }>("/token/refresh/", refresh);
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
