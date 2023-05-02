interface IFinancialStore {
	payments: {
		data: IPaymentPagination[]
		pagination: {
			currentPage: number
			hasNext: boolean
			hasPrevious: boolean
			totalPages: number
		}
		loading: boolean
		filters: IPaymentFilters
		modal: {
			payoff: {
				visible: boolean
				data: IPaymentModalPayoffDataSource[]
			}
		}
	}
	paymentDetail: {
		data: IPaymentDetail
		loading: boolean
	}
	paymentReport: {
		loading: boolean
		data: {
			payments: IPaymentCharts[]
			open: IPaymentReportOpen[]
			closed: IPaymentReportClosed[]
			fixed_debit: number
			fixed_credit: number
			invoiceByTag: IInvoiceByTag[]
			countPayment: number
			amountPayment: number
			amountPaymentOpen: number
			amountPaymentClosed: number
		}
	}
	contracts: {
		data: IContractPagination[]
		loading: boolean
		modal: IModalContracts
		pagination: {
			currentPage: number
			hasNext: boolean
			hasPrevious: boolean
			totalPages: number
		}
		filters: IContractFilters
	}
	contractDetail: {
		data: IContractDetail
		invoices: IContractInvoicesDetail
		contracts: IContractPagination[]
		loading: boolean
		modal: IModalContract
	}
	invoices: {
		data: IInvoicePagination[]
		loading: boolean
		modal: IModalInvoice
		pagination: {
			currentPage: number
			hasNext: boolean
			hasPrevious: boolean
			totalPages: number
		}
		filters: IInvoiceFilters
	}
	invoiceDetail: {
		data: IInvoiceDetail
		payments: IInvoicePaymentsDetail
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

interface IPaymentCharts {
	label: string
	debit: number
	credit: number
	total: number
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

interface IInvoiceByTag {
	id: number
	name: string
	color: string
	amount: number
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
}

interface IContractInvoicesDetail {
	data: IInvoicePagination[]
	loading: boolean
	pagination: {
		currentPage: number
		hasNext: boolean
		hasPrevious: boolean
		totalPages: number
	}
	filters: IInvoiceFilters
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
	tags: ITags[]
}

interface IInvoicePaymentsDetail {
	data: IPaymentPagination[]
	loading: boolean
	pagination: {
		currentPage: number
		hasNext: boolean
		hasPrevious: boolean
		totalPages: number
	}
	filters: IPaymentFilters
}

interface ITags {
	id: number
	name: string
	color: string
}

interface IPaymentModalPayoffDataSource {
	status: number
	id: number
	description: string
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

type PayloadChangeStatusPaymentPaginationAction = {
	id: number
	status: number
}
