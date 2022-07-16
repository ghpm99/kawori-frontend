import axios from 'axios'

const apiFacetexture = axios.create({
	baseURL: '/api/facetexture',
})

let tried = 0
const retryMaxCount = 3
const retryDelay = 1500

const sleepRequest = (milliseconds, originalRequest) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => resolve(apiFacetexture(originalRequest)), milliseconds)
	})
}

apiFacetexture.interceptors.response.use(
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

const djangoApiFacetexture = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL + '/admin-api/facetexture',
	headers: {
		'Access-Control-Allow-Origin': '*',
	},
	responseType: 'blob',
})

interface IFacetextureApi {
	characters: IFacetextureCharacterApi[]
}

export interface IFacetextureCharacterApi {
	id: number
	name: string
	class: {
		id: number
		name: string
		abbreviation: string
		class_image: string
	}
	show: boolean
	order: number
	image: {}
}

export async function fetchFacetextureService() {
	const response = await apiFacetexture.get('/')
	return response.data as IFacetextureApi
}

export async function updateFacetextureService(characters) {
	const response = await apiFacetexture.post('/', characters)
	return response.data
}

export async function fetchFaceTextureClassService(params?) {
	const response = await apiFacetexture.get('/class', {
		params: params,
	})
	return response.data
}

export async function previewFacetextureService(token, args) {
	const response = await djangoApiFacetexture.post(
		'/preview',
		{ ...args },
		{
			headers: {
				Authorization: `Basic ${token}`,
				'Content-Type': 'multipart/form-data',
			},
		}
	)

	return response.data
}

export async function downloadFacetextureService(token, args) {
	const response = await djangoApiFacetexture.post(
		'/download',
		{ ...args },
		{
			headers: {
				Authorization: `Basic ${token}`,
				'Content-Type': 'multipart/form-data',
			},
		}
	)
	return response.data
}
