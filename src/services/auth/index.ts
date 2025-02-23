import axios from "axios";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiDjango } from "..";

const apiLogin = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + "/auth",
    withCredentials: true,
    headers: {
        "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_API_URL,
        "Content-Type": "application/json",
    },
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
