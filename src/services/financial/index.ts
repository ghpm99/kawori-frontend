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
    const response = await apiDjango.get(`/financial/${id}/`)
    return response.data
}

export async function savePaymentDetailService(id, payment){
    const response = await apiDjango.post(`/financial/${id}/save`, payment)
    return response.data
}

export async function payoffPaymentService(id){
    const response = await apiDjango.post(`/financial/${id}/payoff`)
    return response.data
}

export async function fetchPaymentReportService(){
    const response = await apiDjango.get('/financial/report')
    return response.data
}