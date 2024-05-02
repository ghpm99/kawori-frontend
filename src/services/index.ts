import axios from "axios";
import TokenService from './auth/authToken'

export const apiDjango = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + "/",
});

let tried = 0;
const retryMaxCount = 3;
const retryDelay = 1500;

const sleepRequest = (milliseconds: number, originalRequest: any) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(apiDjango(originalRequest)), milliseconds);
    });
};

apiDjango.interceptors.request.use(async (request) => {
    const token = TokenService.getLocalAccessToken()
    if (token) {
        request.headers!.Authorization = `Bearer ${token}`;
    }

    return request;
});

apiDjango.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { config, response } = error;
        const originalRequest = config;

        if (
            (!error.response || response.status === 408 || response.status === 504 || response.status === 500) &&
            tried <= retryMaxCount
        ) {
            tried++;
            return sleepRequest(retryDelay, originalRequest);
        } else {
            return Promise.reject(error);
        }
    },
);
