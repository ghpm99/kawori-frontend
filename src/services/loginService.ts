import axios from 'axios'

const apiLogin = axios.create({
	baseURL: '/api/auth/callback/credentials',
})

export async function loginService(csrfToken, username, password) {
	const response = await apiLogin.post('/', {
		csrfToken,
		username,
		password,
	})
	return response.status
}
