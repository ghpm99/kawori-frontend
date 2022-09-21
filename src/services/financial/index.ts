import { apiDjango } from '..'

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

export async function fetchAllContractService(){
    const response = await apiDjango.get('/financial/contract/')
    return response.data
}

export async function fetchAllInvoiceService(){
    const response = await apiDjango.get('/financial/invoice/')
    return response.data
}

export async function saveNewContractService(data){
    const response = await apiDjango.post('/financial/contract/new', data)
    return response.data
}

export async function fetchDetailContractService(id){
    const response = await apiDjango.get(`/financial/contract/${id}/`)
    return response.data
}

export async function includeNewInvoiceService(data){
    const response = await apiDjango.post(`/financial/contract/${data.id}/invoice/`, data)
    return response.data
}

export async function fetchDetailInvoiceService(id){
    const response = await apiDjango.get(`/financial/invoice/${id}/`)
    return response.data
}

export async function mergeContractService(data){
    const response = await apiDjango.post(`/financial/contract/${data.id}/merge/`, data)
    return response.data
}

export async function fetchTagsService(){
    const response = await apiDjango.get('/financial/tag/')
    return response.data
}

export async function includeNewTagService(tag: {name: string}){
    const response = await apiDjango.post('/financial/tag/new',tag)
    return response.data
}

export async function saveInvoiceTagsService(idInvoice, tags){
    const response = await apiDjango.post(`/financial/invoice/${idInvoice}/tags`, tags)
    return response
}