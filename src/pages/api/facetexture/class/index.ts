import axios from 'axios'
import { getSession } from 'next-auth/react'


const apiFacetexture = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL + '/admin-api/facetexture/class',
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
		const response = await apiFacetexture.get('', {
			headers: {
				Authorization: `Basic ${session.accessToken}`,
			},
			params: req.query
		})
		res.status(response.status).send(response.data)
		res.end()
	}
}