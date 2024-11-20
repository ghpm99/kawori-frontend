import axios, { AxiosError, AxiosInterceptorManager, AxiosResponse } from "axios";
import TokenService from "./auth/authToken";
import * as Sentry from "@sentry/nextjs";
import { refreshTokenService } from "./auth";
import tokenServiceInstance from "./auth/authToken"

export const apiDjango = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + "/",
});

let tried = 0;
const retryMaxCount = 3;
const retryDelay = 1500;
const statusCodeRetry = [401, 408, 504, 500];

const sleepRequest = (milliseconds: number, originalRequest: any) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(apiDjango(originalRequest)), milliseconds);
    });
};

export const attachTokenToRequest = async (request: any) => {
    const token = tokenServiceInstance.getLocalAccessToken();
    if (token) {
        request.headers!.Authorization = `Bearer ${token}`;
    }
    return request;
};

apiDjango.interceptors.request.use(attachTokenToRequest);

const responseInterceptor = (response: AxiosResponse) => {
    return response;
};

const refreshTokenAccess = async (error) => {
    const refreshToken = tokenServiceInstance.getLocalRefreshToken();
    if (!refreshToken) {
        tokenServiceInstance.removeUser();
        return Promise.reject(error);
    }
    const tokenAccessRenew = await refreshTokenService({ refresh: refreshToken });
    tokenServiceInstance.updateLocalAccessToken(tokenAccessRenew.data.access);
};

export const errorInterceptor = async (error: AxiosError) => {
    const { config, response } = error;
    const originalRequest = config;

    if ((!error.response || statusCodeRetry.includes(response?.status as number)) && tried <= retryMaxCount) {
        if (error.response?.status === 401) {
            await refreshTokenAccess(error);
        }
        tried++;
        return sleepRequest(retryDelay, originalRequest);
    } else {
        if (error.response && (error.response.status === 403 || error.response?.status === 401)) {
            tokenServiceInstance.removeUser();
        }
        Sentry.captureException(error);
        return Promise.reject(error);
    }
};

apiDjango.interceptors.response.use(responseInterceptor, errorInterceptor);
