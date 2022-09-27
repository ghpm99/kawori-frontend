import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import {
    fetchAllContractService,
    fetchAllInvoiceService,
    fetchAllPaymentService,
    fetchDetailContractService,
    fetchDetailInvoiceService,
    fetchDetailPaymentService,
    fetchPaymentReportService,
    fetchTagsService,
    saveNewPaymentService,
} from '../../../services/financial'

const initialState = {
	payments: {
		data: [],
		loading: true,
		filters: undefined,
	},
	paymentDetail: {
		data: undefined,
		loading: true,
	},
	paymentReport: {
		loading: true,
		data: undefined
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
		data: undefined,
		contracts: [],
		loading: true,
		modal: {
			mergeContract: {
				id: undefined,
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
		data: undefined,
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
		await saveNewPaymentService(args.payment)
		return args.payment
	}
)

export const fetchPaymentReport = createAsyncThunk(
	'financial/fetchPaymentReport',
	async () => {
		const response = await fetchPaymentReportService()
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
		changeNamePaymentDetails: (state, action) => {
			state.paymentDetail.data.name = action.payload
		},
		changeTypePaymentDetails: (state, action) => {
			state.paymentDetail.data.type = action.payload
		},
		changeFixedPaymentDetails: (state, action) => {
			state.paymentDetail.data.fixed = action.payload
		},
		changeActivePaymentDetails: (state, action) => {
			state.paymentDetail.data.active = action.payload
		},
		changePaymentDatePaymentDetails: (state, action) => {
			state.paymentDetail.data.payment_date = action.payload
		},
		changeValuePaymentDetails: (state, action) => {
			state.paymentDetail.data.value = action.payload
		},
		changeVisibleContractsModal: (state, action) => {
			state.contracts.modal[action.payload.modal].visible =
				action.payload.visible
		},
		changeVisibleInvoiceModal: (state, action) => {
			state.invoices.modal[action.payload.modal].visible =
				action.payload.visible
		},
		changeVisibleModalContract: (state, action) => {
			state.contractDetail.modal[action.payload.name].visible = action.payload.value
		},
		changeValueMergeModal: (state, action) => {
			state.contractDetail.modal.mergeContract.id = action.payload
		},
		setFilterPayments: (state, action) => {
			state.payments.filters = {
				...state.payments.filters,
				[action.payload.name]: action.payload.value ?? '',
			}
		},
		cleanFilterPayments: (state) => {
			state.payments.filters = undefined
		},
		changeVisibleModalTag: (state, action) => {
			state.tags.modal[action.payload.name].visible = action.payload.value
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
			.addCase(fetchTags.pending, (state)=> {
				state.tags.loading = true
			})
			.addCase(fetchTags.fulfilled, (state, action) => {
				state.tags.data = action.payload.data
				state.tags.loading = false
			})
	},
})

export const {
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
