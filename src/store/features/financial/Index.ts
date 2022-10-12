import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
    fetchAllContractService,
    fetchAllInvoiceService,
    fetchAllPaymentService,
    fetchAmountPaymentClosedReportService,
    fetchAmountPaymentOpenReportService,
    fetchAmountPaymentReportService,
    fetchCountPaymentReportService,
    fetchDetailContractService,
    fetchDetailInvoiceService,
    fetchDetailPaymentService,
    fetchPaymentReportService,
    fetchTagsService,
    saveNewPaymentService,
} from '../../../services/financial'

const initialState: IFinancialStore = {
	payments: {
		data: [],
		loading: true,
		filters: {},
	},
	paymentDetail: {
		data: {
			id: 0,
			status: 0,
			type: 0,
			name: '',
			date: '',
			installments: 0,
			payment_date: '',
			fixed: false,
			active: false,
			value: 0,
			invoice: 0,
			invoice_name: '',
			contract: 0,
			contract_name: '',
		},
		loading: true,
	},
	paymentReport: {
		loading: true,
		data: {
			open: [],
			closed: [],
			fixed_credit: 0,
			fixed_debit: 0
		},
		cards: {
			countPayment:{
				value: 0,
				loading: true
			},
			amountPayment: {
				value: 0,
				loading: true
			},
			amountPaymentOpen: {
				value: 0,
				loading: true
			},
			amountPaymentClosed: {
				value: 0,
				loading: true
			}
		}
	},
	contracts: {
		data: [],
		loading: true,
		modal: {
			newPayment: {
				visible: false,
				error: false,
				errorMsg: '',
			},
		},
	},
	contractDetail: {
		data: {
			id: 0,
			name: '',
			value: 0,
			value_open: 0,
			value_closed: 0,
			invoices: []
		},
		contracts: [],
		loading: true,
		modal: {
			mergeContract: {
				id: [],
				visible: false,
				error: false,
				errorMsg: ''
			},
			newInvoice: {
				visible: false,
				error: false,
				errorMsg: '',
			},
		}
	},
	invoices: {
		data: [],
		loading: true,
		modal: {
			newPayment: {
				visible: false,
				error: false,
				errorMsg: '',
			},
		},
	},
	invoiceDetail: {
		data: {
			id: 0,
			status: 0,
			name: '',
			installments: 0,
			value: 0,
			value_open: 0,
			value_closed: 0,
			date: '',
			contract: 0,
			contract_name: '',
			payments: [],
			tags: []
		},
		loading: true
	},
	tags: {
		data: [],
		loading: true,
		modal: {
			newTag: {
				visible: false,
				error: false,
				errorMsg: '',
			}
		}
	}
}

export const fetchAllPayment = createAsyncThunk(
	'financial/fetchAllPayment',
	async (filters: IPaymentFilters) => {
		const response = await fetchAllPaymentService(filters)
		return response
	}
)

export const fetchAllContract = createAsyncThunk(
	'financial/fetchAllContract',
	async (filters: IContractFilters) => {
		const response = await fetchAllContractService(filters)
		return response
	}
)

export const fetchAllInvoice = createAsyncThunk(
	'financial/fetchAllInvoice',
	async (filters: IInvoiceFilters) => {
		const response = await fetchAllInvoiceService(filters)
		return response
	}
)

export const fetchPaymentDetails = createAsyncThunk(
	'financial/fetchPaymentDetails',
	async (id: number) => {
		const response = await fetchDetailPaymentService(id)
		return response
	}
)

export const saveNewPayment = createAsyncThunk(
	'financial/saveNewPayment',
	async (args: { payment: INewPaymentRequest }) => {
		const response = await saveNewPaymentService(args.payment)
		return response
	}
)

export const fetchPaymentReport = createAsyncThunk(
	'financial/fetchPaymentReport',
	async () => {
		const response = await fetchPaymentReportService()
		return response
	}
)

export const fetchCountPaymentReport = createAsyncThunk(
	'financial/fetchCountPaymentReport',
	async () => {
		const response = await fetchCountPaymentReportService()
		return response
	}
)

export const fetchAmountPaymentReport = createAsyncThunk(
	'financial/fetchAmountPaymentReport',
	async () => {
		const response = await fetchAmountPaymentReportService()
		return response
	}
)

export const fetchAmountPaymentOpenReport = createAsyncThunk(
	'financial/fetchAmountPaymentOpenReport',
	async () => {
		const response = await fetchAmountPaymentOpenReportService()
		return response
	}
)

export const fetchAmountPaymentClosedReport = createAsyncThunk(
	'financial/fetchAmountPaymentClosedReport',
	async () => {
		const response = await fetchAmountPaymentClosedReportService()
		return response
	}
)

export const fetchContractDetails = createAsyncThunk(
	'financial/fetchContractDetails',
	async (id: number) => {
		const response = await fetchDetailContractService(id)
		return response
	}
)

export const fetchInvoiceDetails = createAsyncThunk(
	'financial/fetchInvoiceDetails',
	async (id: number) => {
		const response = await fetchDetailInvoiceService(id)
		return response
	}
)

export const fetchTags = createAsyncThunk(
	'financial/fetchTags',
	async () => {
		const response = await fetchTagsService()
		return response
	}
)

export const financialSlice = createSlice({
	name: 'financial',
	initialState,
	reducers: {
		changeStatusPaymentDetails: (state: IFinancialStore, action: PayloadAction<number>) => {
			state.paymentDetail.data.status = action.payload
		},
		changeNamePaymentDetails: (state: IFinancialStore, action: PayloadAction<string>) => {
			state.paymentDetail.data.name = action.payload
		},
		changeTypePaymentDetails: (state: IFinancialStore, action: PayloadAction<number>) => {
			state.paymentDetail.data.type = action.payload
		},
		changeFixedPaymentDetails: (state: IFinancialStore, action: PayloadAction<boolean>) => {
			state.paymentDetail.data.fixed = action.payload
		},
		changeActivePaymentDetails: (state: IFinancialStore, action: PayloadAction<boolean>) => {
			state.paymentDetail.data.active = action.payload
		},
		changePaymentDatePaymentDetails: (state: IFinancialStore, action: PayloadAction<string>) => {
			state.paymentDetail.data.payment_date = action.payload
		},
		changeValuePaymentDetails: (state: IFinancialStore, action: PayloadAction<number>) => {
			state.paymentDetail.data.value = action.payload
		},
		changeVisibleContractsModal: (state: IFinancialStore, action: PayloadAction<PayloadChangeVisibleModalContractsAction>) => {
			state.contracts.modal[action.payload.modal].visible =
				action.payload.visible
		},
		changeVisibleInvoiceModal: (state: IFinancialStore, action: PayloadAction<PayloadChangeVisibleModalInvoiceAction>) => {
			state.invoices.modal[action.payload.modal].visible =
				action.payload.visible
		},
		changeVisibleModalContract: (state: IFinancialStore, action: PayloadAction<PayloadChangeVisibleModalContractAction>) => {
			state.contractDetail.modal[action.payload.modal].visible = action.payload.visible
		},
		changeValueMergeModal: (state: IFinancialStore, action: PayloadAction<number[]>) => {
			state.contractDetail.modal.mergeContract.id = action.payload
		},
		setFilterPayments: (state: IFinancialStore, action) => {
			state.payments.filters = {
				...state.payments.filters,
				[action.payload.name]: action.payload.value ?? '',
			}
		},
		cleanFilterPayments: (state: IFinancialStore) => {
			state.payments.filters = {}
		},
		changeVisibleModalTag: (state: IFinancialStore, action: PayloadAction<PayloadChangeVisibleModalTagsAction>) => {
			state.tags.modal[action.payload.modal].visible = action.payload.visible
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAllPayment.pending, (state) => {
				state.payments.loading = true
			})
			.addCase(fetchAllPayment.fulfilled, (state, action) => {
				state.payments.data = action.payload.data
				state.payments.loading = false
			})
			.addCase(saveNewPayment.fulfilled, (state, action) => {
				state.payments.data.push(action.payload)
			})
			.addCase(fetchPaymentDetails.pending, (state) => {
				state.paymentDetail.loading = true
			})
			.addCase(fetchPaymentDetails.fulfilled, (state, action) => {
				state.paymentDetail.data = action.payload.data
				state.paymentDetail.loading = false
			})
			.addCase(fetchPaymentReport.pending, (state) => {
				state.paymentReport.loading = true
			})
			.addCase(fetchPaymentReport.fulfilled, (state, action) => {
				state.paymentReport.loading = false
				state.paymentReport.data = action.payload.data
			})
			.addCase(fetchCountPaymentReport.pending, (state) => {
				state.paymentReport.cards.countPayment.loading = true
			})
			.addCase(fetchCountPaymentReport.fulfilled, (state, action) => {
				state.paymentReport.cards.countPayment.loading = false
				state.paymentReport.cards.countPayment.value = action.payload.data
			})
			.addCase(fetchAmountPaymentReport.pending, (state) => {
				state.paymentReport.cards.amountPayment.loading = true
			})
			.addCase(fetchAmountPaymentReport.fulfilled, (state, action) => {
				state.paymentReport.cards.amountPayment.loading = false
				state.paymentReport.cards.amountPayment.value = action.payload.data
			})
			.addCase(fetchAmountPaymentOpenReport.pending, (state) => {
				state.paymentReport.cards.amountPaymentOpen.loading = true
			})
			.addCase(fetchAmountPaymentOpenReport.fulfilled, (state, action) => {
				state.paymentReport.cards.amountPaymentOpen.loading = false
				state.paymentReport.cards.amountPaymentOpen.value = action.payload.data
			})
			.addCase(fetchAmountPaymentClosedReport.pending, (state) => {
				state.paymentReport.cards.amountPaymentClosed.loading = true
			})
			.addCase(fetchAmountPaymentClosedReport.fulfilled, (state, action) => {
				state.paymentReport.cards.amountPaymentClosed.loading = false
				state.paymentReport.cards.amountPaymentClosed.value = action.payload.data
			})
			.addCase(fetchAllContract.pending, (state) => {
				state.contracts.loading = true
			})
			.addCase(fetchAllContract.fulfilled, (state, action) => {
				state.contracts.data = action.payload.data
				state.contractDetail.contracts = action.payload.data
				state.contracts.loading = false
			})
			.addCase(fetchAllInvoice.pending, (state) => {
				state.invoices.loading = true
			})
			.addCase(fetchAllInvoice.fulfilled, (state, action) => {
				state.invoices.data = action.payload.data
				state.invoices.loading = false
			})
			.addCase(fetchContractDetails.pending, (state) => {
				state.contractDetail.loading = true
			})
			.addCase(fetchContractDetails.fulfilled, (state, action) => {
				state.contractDetail.data = action.payload.data
				state.contractDetail.loading = false
			})
			.addCase(fetchInvoiceDetails.pending, (state) => {
				state.invoiceDetail.loading = true
			})
			.addCase(fetchInvoiceDetails.fulfilled, (state, action) => {
				state.invoiceDetail.data = action.payload.data
				state.invoiceDetail.loading = false
			})
			.addCase(fetchTags.pending, (state) => {
				state.tags.loading = true
			})
			.addCase(fetchTags.fulfilled, (state, action) => {
				state.tags.data = action.payload.data
				state.tags.loading = false
			})
	},
})

export const {
	changeStatusPaymentDetails,
	changeNamePaymentDetails,
	changeTypePaymentDetails,
	changeFixedPaymentDetails,
	changeActivePaymentDetails,
	changePaymentDatePaymentDetails,
	changeValuePaymentDetails,
	changeVisibleContractsModal,
	changeVisibleInvoiceModal,
	changeVisibleModalContract,
	changeValueMergeModal,
	setFilterPayments,
	cleanFilterPayments,
	changeVisibleModalTag,
} = financialSlice.actions

export default financialSlice.reducer
