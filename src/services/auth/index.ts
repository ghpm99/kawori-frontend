import axios, { AxiosError, AxiosResponse, HttpStatusCode } from "axios";

import * as Sentry from "@sentry/nextjs";

let isRefreshingToken = false;
let refreshPromise: Promise<any> | null = null;

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

    if (response.status === HttpStatusCode.Unauthorized) {
        try {
            await refreshTokenAsync();
            return apiAuth(originalRequest);
        } catch (refreshError) {
            Sentry.captureException(refreshError);
            return Promise.reject(refreshError);
        }
    }

    Sentry.captureException(error);
    return Promise.reject(error);
};

apiAuth.interceptors.response.use(responseInterceptor, errorInterceptor);

apiAuth.get("/csrf/");

export const refreshTokenAsync = async () => {
    if (isRefreshingToken) {
        console.log("Já está atualizando o token, aguardando...");
        return refreshPromise;
    }

    isRefreshingToken = true;
    refreshPromise = new Promise(async (resolve, reject) => {
        try {
            console.log("Iniciando atualização do token...");
            const refreshResponse = await refreshTokenService();
            console.log("Resposta da atualização do token:", refreshResponse);

            if (refreshResponse.status !== 200) {
                console.error("Falha ao atualizar o token:", refreshResponse);
                reject(new Error("Falha ao atualizar o token"));
            } else {
                resolve(refreshResponse.data); // Resolve com os dados da resposta
            }
        } catch (error) {
            console.error("Erro ao atualizar o token:", error);
            reject(error); // Rejeita a promessa em caso de erro
        } finally {
            console.log("Finalizando atualização do token, liberando semáforo...");
            isRefreshingToken = false;
            refreshPromise = null;
        }
    });

    return refreshPromise; // Retorna a promessa
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
