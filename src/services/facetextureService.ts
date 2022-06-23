import axios from 'axios'


const apiFacetexture = axios.create({
    baseURL: '/api/facetexture'
})

export async function fetchFacetextureService(){
    const response = await apiFacetexture.get('/')
    return response.data
}

export async function updateFacetextureService(characters){
    const response = await apiFacetexture.post('/', characters)
    return response.data
}

export async function fetchFaceTextureClassService() {
    const response = await apiFacetexture.get('/class')
    return response.data
}