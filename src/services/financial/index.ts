import { apiDjango } from '..';

export async function fetchAllPaymentService(filters?){
    const response = await apiDjango.get('/financial/',{
        params: filters,
    })
    return response.data
}

export async function saveNewPaymentService(data){
    const response = await apiDjango.post('/financial/', data)
    return response.data
}

export async function fetchDetailPaymentService(id){
    const response = await apiDjango.get(`/financial/details/${id}`)
    return response.data
}

export async function savePaymentDetailService(id, payment){
    const response = await apiDjango.post(`/financial/details/${id}`, payment)
    return response.data
}

export async function payoffPaymentService(id){
    const response = await apiDjango.post(`/financial/payoff/${id}`)
    return response.data
}

export async function fetchPaymentReportService(){
    const response = await apiDjango.get('/financial/report')
    return response.data
}