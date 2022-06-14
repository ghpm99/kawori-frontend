declare type financialFilter = {
    status?: number,
    type?: number,
    name__icontains?: string,
    date__gte?: string,
    date__lte?: string,
    installments?: number,
    payment_date__gte?: string,
    payment_date__lte?: string,
    fixed?: boolean,
    active?: boolean
}