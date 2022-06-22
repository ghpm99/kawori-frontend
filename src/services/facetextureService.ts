import axios from 'axios'


const apiFinancial = axios.create({
    baseURL: '/api/facetexture/'
})

export async function fetchFacetextureService(){
    const response = await apiFinancial.get('/')
    return response.data
}