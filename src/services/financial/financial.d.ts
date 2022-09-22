
interface IContractFilters {
    id?: number
}

interface IInvoiceFilters {
    status?: number
    name__icontains?: string
    installments?: number
    date__gte?: string
    date__lte?: string
}