import axios, { AxiosError, AxiosResponse, HttpStatusCode } from "axios";

import * as Sentry from "@sentry/nextjs";

let hasRefreshToken = false

export const apiAuth = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + "/auth/",
    withCredentials: true,
    headers: {
        "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_API_URL,
        "Content-Type": "application/json",
    },
});

const responseInterceptor = (response: AxiosResponse) => {
    return response;
};

const errorInterceptor = async (error: AxiosError) => {
    const { config, response } = error;
    const originalRequest = config;

    if (!response?.status) {
        console.log("capturando erro", !response?.status);
        Sentry.captureException(error);
        return Promise.reject(error);
    }

    if (response.status === HttpStatusCode.Unauthorized && await refreshTokenAsync()) {
        return apiAuth(originalRequest)
    }

    Sentry.captureException(error);
    return Promise.reject(error);
};

apiAuth.interceptors.response.use(responseInterceptor, errorInterceptor);

apiAuth.get("/csrf/");



export const refreshTokenAsync = async () => {
    if(hasRefreshToken) return
    hasRefreshToken = true
    const refreshResponse = await refreshTokenService();
    console.log(refreshResponse);
    hasRefreshToken = false
    if (refreshResponse.status !== 200) {
        return false
    }
    return true
};

export const refreshTokenService = async () => {
    const response = await apiAuth.post<{ msg: string }>("token/refresh/");
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
    const response = apiAuth.post<{ msg: string }>("signup", user);
    return response;
};
