import axios from 'axios'

const apiLogin = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + '/auth',
})

export async function signinService(username, password) {
    const response = await apiLogin.post('/signin', {
        credentials: {
            username,
            password
        }
    })
    return response.status
}

interface INewUser {
    username: string
    password: string
    email: string
    name: string
    last_name: string
}

export async function signupService(user: INewUser) {
    const response = await apiLogin.post('/signup', user)
    return {
        data: response.data,
        status: response.status,
        statusText: response.statusText
    }
}