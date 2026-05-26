import * as Sentry from "@sentry/nextjs";
import axios, { AxiosError, AxiosResponse, HttpStatusCode, InternalAxiosRequestConfig } from "axios";
import { refreshTokenAsync } from "./auth";
import { getAccessToken } from "./token";

export const apiDjango = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + "/",
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach the bearer token to every request that has one.
apiDjango.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const responseInterceptor = (response: AxiosResponse) => {
    return response;
};

export const errorInterceptor = async (error: AxiosError) => {
    const config = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const { response } = error;

    if (!config) {
        return Promise.reject(error);
    }

    // On the first 401, try to refresh the access token once and replay the
    // request with the fresh bearer. refreshTokenAsync notifies the app when the
    // refresh token itself is gone/expired, so there is no retry loop here.
    if (response?.status === HttpStatusCode.Unauthorized && !config._retry) {
        config._retry = true;
        try {
            const access = await refreshTokenAsync();
            config.headers.Authorization = `Bearer ${access}`;
            return apiDjango.request(config);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }

    Sentry.captureException(error);
    return Promise.reject(error);
};

apiDjango.interceptors.response.use(responseInterceptor, errorInterceptor);
