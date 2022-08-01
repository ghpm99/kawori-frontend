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
	const { id } = req.query

	if (!session) {
		res.status(400).send('User not defined')
		res.end()
	}

	if (req.method === 'GET') {
		const response = await apiFinancial.get(`/${id}/`, {
			headers: {
				Authorization: `Basic ${session.accessToken}`,
			},
		})
		res.status(response.status).send(response.data)
		res.end()
	} else if (req.method === 'POST') {
		const response = await apiFinancial.post(`/${id}/save`, req.body, {
			headers: {
				Authorization: `Basic ${session.accessToken}`,
			},
		})
		res.status(response.status).send(response.data)
		res.end()
	}
}
