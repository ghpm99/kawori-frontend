interface IFinancialStore {
    payments: {
        data: IPaymentPagination[]
        loading: boolean
        filters: IPaymentFilters
    }
    paymentDetail: {
        data: IPaymentDetail
        loading: boolean
    }
    paymentReport: {
        loading: boolean
        data: {
            open: IPaymentReportOpen[]
            closed: IPaymentReportClosed[]
            fixed_debit: number
            fixed_credit: number
        }
    }
    contracts: {
        data: IContractPagination[]
        loading: boolean
        modal: IModalContracts
    }
    contractDetail: {
        data: IContractDetail
        contracts: IContractPagination[]
        loading: boolean
        modal: IModalContract
    }
    invoices: {
        data: IInvoicePagination[]
        loading: boolean
        modal: IModalInvoice
    }
    invoiceDetail: {
        data: IInvoiceDetail
        loading: boolean
    }
    tags: {
        data: ITags[]
        loading: boolean
        modal: IModalTags
    }
}

interface IModalContracts {
    newPayment: {
        visible: boolean
        error: boolean
        errorMsg: string
    }
}

interface IModalContract {
    mergeContract: {
        id: number[]
        visible: boolean
        error: boolean
        errorMsg: string
    }
    newInvoice: {
        visible: boolean
        error: boolean
        errorMsg: string
    }
}

interface IModalInvoice {
    newPayment: {
        visible: boolean
        error: boolean
        errorMsg: string
    }
}

interface IModalTags {
    newTag: {
        visible: boolean
        error: boolean
        errorMsg: string
    }
}

interface IPaymentReportOpen {
    label: string
    debit: number
    credit: number
    fixed_debit_open: number
    fixed_credit_open: number
}

interface IPaymentReportClosed {
    label: string
    debit: number
    credit: number
}

interface IPaymentPagination {
    id: number
    status: number
    type: number
    name: string
    date: string
    installments: number
    payment_date: string
    fixed: boolean
    value: number
}

interface IPaymentDetail {
    id: number
    status: number
    type: number
    name: string
    date: string
    installments: number
    payment_date: string
    fixed: boolean
    active: boolean
    value: number
    invoice: number
    invoice_name: string
    contract: number
    contract_name: string
}

interface IContractPagination {
    id: number
    name: string
    value: number
    value_open: number
    value_closed: number
}

interface IContractDetail {
    id: number
    name: string
    value: number
    value_open: number
    value_closed: number
    invoices: IInvoicePagination[]
}

interface IInvoicePagination {
    id: number
    status: number
    name: string
    installments: number
    value: number
    value_open: number
    value_closed: number
    date: string
    contract: number
    tags: ITags[]
}

interface IInvoiceDetail {
    id: number
    status: number
    name: string
    installments: number
    value: number
    value_open: number
    value_closed: number
    date: string
    contract: number
    contract_name: string
    payments: IPaymentPagination[]
    tags: ITags[]
}

interface ITags {
    id: number
    name: string
    color: string
}

type PayloadChangeVisibleModalContractsAction = {
    modal: keyof IModalContracts
    visible: boolean
}

type PayloadChangeVisibleModalInvoiceAction = {
    modal: keyof IModalInvoice
    visible: boolean
}

type PayloadChangeVisibleModalContractAction = {
    modal: keyof IModalContract
    visible: boolean
}

type PayloadChangeVisibleModalTagsAction = {
    modal: keyof IModalTags
    visible: boolean
}