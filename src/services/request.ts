
import { RootState, store } from '@/store/store'
import { createAsyncThunk, isPending } from '@reduxjs/toolkit'
import { Axios, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { apiDjango } from "."

type requestMap = Map<string, any>

type GetType = Axios['get']
type PostType = Axios['post']
type PutType = Axios['put']
type DeleteType = Axios['delete']

type RequestType = GetType | PostType | PutType | DeleteType

const thunkMap: Map<string, requestMap> = new Map()

export const createControlledRequest = <T, R>(
    typePrefix: string,
    requestType: RequestType,
    requestUrl: string,
    requestConfig: AxiosRequestConfig = {},
    singleRequest: boolean = false,
) => {
    const initializeRequestList = () => {
        if (!thunkMap.has(typePrefix)) {
            thunkMap.set(typePrefix, new Map())
        }
    }

    const asyncThunk = createAsyncThunk(
        typePrefix,
        async (args: T, { signal, rejectWithValue, getState, requestId }) => {
            const currentRequests = (getState() as RootState).loading.requests[typePrefix]
            initializeRequestList()

            if (currentRequests.length > 0 && singleRequest) {
                abortAllRequest()
            }
            for (const value in thunkMap.get(typePrefix)?.values()) {
                if (!currentRequests.includes(value)) thunkMap.get(typePrefix)?.delete(value)
            }
            registerRequest(requestId, null)
            try {
                let response = null
                if ((requestType as PostType) || (requestType as PutType)) {
                    response = await requestType<R>(requestUrl, args, {
                        ...requestConfig,
                        signal: signal,
                    })
                } else {
                    response = await requestType<R>(requestUrl, {
                        ...requestConfig,
                        params: args,
                        signal: signal,
                    })
                }
                const data = await response.data
                return {
                    data: data,
                    args: args,
                }
            } catch (err) {
                console.log('erro de request', err)
                if (err instanceof AxiosError) {
                    return rejectWithValue(err.response.data ?? err.message)
                } else {
                    return rejectWithValue(err)
                }
            }
        },
    )

    const dispatchRequest = (args: T) => {
        const promise = store.dispatch(asyncThunk(args))
        promise.then(() => {
            thunkMap.get(typePrefix)?.delete(promise.requestId)
        })
        thunkMap.get(typePrefix)?.set(promise.requestId, promise)
        return promise
    }

    const registerRequest = (requestId: string, promise: any) => {
        thunkMap.get(typePrefix)?.set(requestId, promise)
    }

    const abortAllRequest = () => {
        thunkMap.get(typePrefix)?.forEach((promise, _, map) => {
            if (promise) {
                promise.abort()
                map.delete(promise.requestId)
            }
        })
    }

    const abortRequest = (requestId: string) => {
        const promise = thunkMap.get(typePrefix)?.get(requestId)
        if (promise && isPending(promise.promise)) promise.promise.abort()
    }

    return {
        asyncThunk,
        dispatchRequest,
        abortRequest,
        registerRequest,
        abortAllRequest,
    }
}

export const createControlledGetRequest = <T, R>(
    typePrefix: string,
    requestUrl: string,
    requestConfig: AxiosRequestConfig = {},
    singleRequest: boolean = false,
) => {
    return createControlledRequest<T, R>(typePrefix, apiDjango.get, requestUrl, requestConfig, singleRequest)
}

export const createControlledPostRequest = <T, R>(
    typePrefix: string,
    requestUrl: string,
    requestConfig: AxiosRequestConfig = {},
    singleRequest: boolean = false,
) => {
    return createControlledRequest<T, R>(typePrefix, apiDjango.post, requestUrl, requestConfig, singleRequest)
}

export const createControlledPutRequest = <T, R>(
    typePrefix: string,
    requestUrl: string,
    requestConfig: AxiosRequestConfig = {},
    singleRequest: boolean = false,
) => {
    return createControlledRequest<T, R>(typePrefix, apiDjango.put, requestUrl, requestConfig, singleRequest)
}

export const createControlledDeleteRequest = <T, R>(
    typePrefix: string,
    requestUrl: string,
    requestConfig: AxiosRequestConfig = {},
    singleRequest: boolean = false,
) => {
    return createControlledRequest<T, R>(typePrefix, apiDjango.delete, requestUrl, requestConfig, singleRequest)
}
