"use client";
import * as Sentry from "@sentry/nextjs";
import axios, { InternalAxiosRequestConfig } from "axios";

import { getAccessToken, getRefreshToken, setTokens } from "@/services/token";

export const apiAuth = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + "/auth/",
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach the bearer token to every request that has one.
apiAuth.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Single-flight refresh: concurrent 401s share a single token/refresh/ call so
// we never fire a stampede of refreshes. The refresh token travels in the body
// (Bearer flow); on success we persist the new access token, on failure we
// notify the app (AuthProvider listens for `tokenRefreshFailed`) and reject.
let refreshing: Promise<string> | null = null;

export const refreshTokenAsync = async (): Promise<string> => {
    if (!refreshing) {
        const refresh = getRefreshToken();
        refreshing = apiAuth
            .post<{ access: string }>("token/refresh/", { refresh })
            .then((res) => {
                setTokens(res.data.access);
                return res.data.access;
            })
            .catch((error) => {
                Sentry.captureException(error);
                if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("tokenRefreshFailed"));
                }
                throw error;
            })
            .finally(() => {
                refreshing = null;
            });
    }
    return refreshing;
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
