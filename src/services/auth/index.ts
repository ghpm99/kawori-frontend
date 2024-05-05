import axios from "axios";
import { createControlledPostRequest, createControlledRequest } from "../request";

const apiLogin = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + "/auth",
});

export const signinControlledRequest = createControlledRequest<
    { username: string; password: string },
    { accessToken: string; refreshToken: string }
>("auth/signin", apiLogin.post, "/token", {}, true);

export const verifyTokenControlledRequest = createControlledRequest<{ accessToken: string }, undefined>(
    "auth/verify",
    apiLogin.post,
    "/token/verify/",
    {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        },
    },
    true,
);

export const refreshTokenControlledRequest = createControlledRequest<{ refreshToken: string }, { accessToken: string }>(
    "auth/refresh",
    apiLogin.post,
    "/token/refresh/",
    {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        },
    },
    true,
);

export interface INewUser {
    username: string;
    password: string;
    email: string;
    name: string;
    last_name: string;
}

export const signupControlledRequest = createControlledRequest<INewUser, { msg: string }>(
    "auth/signup",
    apiLogin.post,
    "/signup",
    {},
    true,
);
