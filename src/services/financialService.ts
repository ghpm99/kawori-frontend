import axios from 'axios';

const apiFinancial = axios.create({
    baseURL: '/api/financial/'
})

export async function fetchAllPaymentService(filters?){
    const response = await apiFinancial.get('/',{
        params: filters,
    })
    return response.data
}

export async function saveNewPaymentService(data){
    const response = await apiFinancial.post('/', data)
    return response.data
}

export async function fetchDetailPaymentService(id){
    const response = await apiFinancial.get(`/details/${id}`)
    return response.data
}

export async function savePaymentDetailService(id, payment){
    const response = await apiFinancial.post(`/details/${id}`, payment)
    return response.data
}

export async function payoffPaymentService(id){
    const response = await apiFinancial.post(`/payoff/${id}`)
    return response.data
}

export async function fetchPaymentReportService(){
    const response = await apiFinancial.get('/report/')
    return response.data
}