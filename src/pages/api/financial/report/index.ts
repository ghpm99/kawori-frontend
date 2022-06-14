import axios from 'axios'
import { getSession } from 'next-auth/react'

const apiFinancial = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL + '/admin-api/financial',
	headers: {
		'Access-Control-Allow-Origin': '*',
	},
})

export default async (req, res) => {
	const session = await getSession({ req })

	if(!session){
		res.status(400).send('User not defined')
		res.end()
	}

	if (req.method === 'GET') {
		const response = await apiFinancial.get('/report', {
			headers: {
				Authorization: `Basic ${session.accessToken}`,
			}
		})
		res.status(response.status).send(response.data)
		res.end()
	}
}
