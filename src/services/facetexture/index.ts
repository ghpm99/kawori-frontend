import { apiDjango } from '..'

interface IFacetextureApi {
	characters: IFacetextureCharacterApi[]
}

export interface IFacetextureCharacterApi {
	name: string
	class: {
		id: number
		name: string
		abbreviation: string
		class_image: string
	}
	show: boolean
	image: {}
}

export async function fetchFacetextureService() {
	const response = await apiDjango.get('/facetexture/')
	return response.data as IFacetextureApi
}

export async function updateFacetextureService(characters) {
	const response = await apiDjango.post('/facetexture/', characters)
	return response.data
}

export async function fetchFaceTextureClassService(params?) {
	const response = await apiDjango.get('/facetexture/class', {
		params: params,
	})
	return response.data
}

export async function previewFacetextureService(token, args) {
	const response = await apiDjango.post(
		'/facetexture/preview',
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
	const response = await apiDjango.post(
		'/facetexture/download',
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