import axios from 'axios';
import { getSession, useSession } from 'next-auth/react';

export const apiDjango = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL + '/admin-api',
})

let tried = 0
const retryMaxCount = 3
const retryDelay = 1500

const sleepRequest = (milliseconds, originalRequest) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => resolve(apiDjango(originalRequest)), milliseconds)
	})
}

apiDjango.interceptors.request.use(async (request) => {
    const session = await getSession()
	const token = session.accessToken
	if (token) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		request.headers!.Authorization = `Bearer ${token}`
	}

	return request
})

apiDjango.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
		const { config, response } = error
		const originalRequest = config

		if (
			(!error.response || response.status === 408 || response.status === 504) &&
			tried <= retryMaxCount
		) {
			tried++
			return sleepRequest(retryDelay, originalRequest)
		} else {
			return Promise.reject(error)
		}
	}
)