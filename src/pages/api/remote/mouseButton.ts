import axios from 'axios'
import { getSession } from 'next-auth/react'

const apiRemote = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL + '/admin-api/remote',
    headers: {
        "Access-Control-Allow-Origin": "*"
    },
})

export default async (req, res) => {
    if(req.method !== 'POST'){
        res.status(400).send({message: 'Only POST requests allowed'})
        return
    }
    const session = await getSession({req})
    const response = await apiRemote.post('/mouse-button', req.body, {
        headers:{
            'Authorization': `Basic ${session.accessToken}`
        }
    })

    res.status(response.status).send(response.data)
    res.end()
}