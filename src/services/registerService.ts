import axios from 'axios';

const djangoApi = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL + '/auth/register',
	headers: {
		'Access-Control-Allow-Origin': '*',
	},
})

interface INewUser {
    username: string
    password: string
    email: string
    name: string
    last_name: string
}

export async function registerService(user: INewUser) {
    const response = await djangoApi.post('', user)
    return {
        data: response.data,
        status: response.status,
        statusText: response.statusText
    }
}