import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
    fetchAllContractService,
    fetchAllInvoiceService,
    fetchAllPaymentService,
    fetchAmountInvoiceByTagReportService,
    fetchAmountPaymentClosedReportService,
    fetchAmountPaymentOpenReportService,
    fetchAmountPaymentReportService,
    fetchCountPaymentReportService,
    fetchDetailContractInvoicesService,
    fetchDetailContractService,
    fetchDetailInvoicePaymentsService,
    fetchDetailInvoiceService,
    fetchDetailPaymentService,
    fetchPaymentReportService,
    fetchTagsService,
    saveNewPaymentService,
} from "../../../services/financial";

const initialState: IContractStore = {
        data: [],
        loading: true,
        modal: {
            newPayment: {
                visible: false,
                error: false,
                errorMsg: "",
            },
        },
        filters: {
            page: 1,
            page_size: 20,
        },
        pagination: {
            currentPage: 1,
            hasNext: false,
            hasPrevious: false,
            totalPages: 1,
        }
};

export const fetchAllPayment = createAsyncThunk("financial/fetchAllPayment", async (filters: IPaymentFilters) => {
    const response = await fetchAllPaymentService(filters);
    return {
        filters,
        response,
    };
});

export const fetchAllContract = createAsyncThunk("financial/fetchAllContract", async (filters: IContractFilters) => {
    const response = await fetchAllContractService(filters);
    return {
        filters,
        response,
    };
});

export const fetchAllInvoice = createAsyncThunk("financial/fetchAllInvoice", async (filters: IInvoiceFilters) => {
    const response = await fetchAllInvoiceService(filters);
    return {
        filters,
        response,
    };
});

export const fetchPaymentDetails = createAsyncThunk("financial/fetchPaymentDetails", async (id: number) => {
    const response = await fetchDetailPaymentService(id);
    return response;
});

export const saveNewPayment = createAsyncThunk(
    "financial/saveNewPayment",
    async (args: { payment: INewPaymentRequest }) => {
        const response = await saveNewPaymentService(args.payment);
        return response;
    },
);

export const fetchPaymentReport = createAsyncThunk("financial/fetchPaymentReport", async () => {
    const charts = await fetchPaymentReportService();
    const count = await fetchCountPaymentReportService();
    const amount = await fetchAmountPaymentReportService();
    const amountOpen = await fetchAmountPaymentOpenReportService();
    const amountClosed = await fetchAmountPaymentClosedReportService();
    const amountByTag = await fetchAmountInvoiceByTagReportService();
    return {
        charts: charts,
        count: count,
        amount: amount,
        amountOpen: amountOpen,
        amountClosed: amountClosed,
        amountByTag: amountByTag,
    };
});

export const fetchContractDetails = createAsyncThunk("financial/fetchContractDetails", async (id: number) => {
    const response = await fetchDetailContractService(id);
    return response;
});

export const fetchContractInvoicesDetails = createAsyncThunk(
    "financial/fetchContractInvoicesDetails",
    async (args: { id: number; filters: IInvoiceFilters }) => {
        const response = await fetchDetailContractInvoicesService(args.id, args.filters);
        return {
            filters: args.filters,
            response,
        };
    },
);

export const fetchInvoiceDetails = createAsyncThunk("financial/fetchInvoiceDetails", async (id: number) => {
    const response = await fetchDetailInvoiceService(id);
    return response;
});

export const fetchInvoicePaymentsDetails = createAsyncThunk(
    "financial/",
    async (args: { id: number; filters: IPaymentFilters }) => {
        const response = await fetchDetailInvoicePaymentsService(args.id, args.filters);
        return {
            filters: args.filters,
            response,
        };
    },
);

export const fetchTags = createAsyncThunk("financial/fetchTags", async () => {
    const response = await fetchTagsService();
    return response;
});

export const contractSlice = createSlice({
    name: "contract",
    initialState,
    reducers: {
        changeStatusPaymentDetails: (state: IFinancialStore, action: PayloadAction<number>) => {
            state.paymentDetail.data.status = action.payload;
        },
        changeStatusPaymentPagination: (
            state: IFinancialStore,
            action: PayloadAction<PayloadChangeStatusPaymentPaginationAction>,
        ) => {
            const index = state.payments.data.findIndex((item) => item.id === action.payload.id);
            state.payments.data[index].status = action.payload.status;
        },
        changeNamePaymentDetails: (state: IFinancialStore, action: PayloadAction<string>) => {
            state.paymentDetail.data.name = action.payload;
        },
        changeTypePaymentDetails: (state: IFinancialStore, action: PayloadAction<number>) => {
            state.paymentDetail.data.type = action.payload;
        },
        changeFixedPaymentDetails: (state: IFinancialStore, action: PayloadAction<boolean>) => {
            state.paymentDetail.data.fixed = action.payload;
        },
        changeActivePaymentDetails: (state: IFinancialStore, action: PayloadAction<boolean>) => {
            state.paymentDetail.data.active = action.payload;
        },
        changePaymentDatePaymentDetails: (state: IFinancialStore, action: PayloadAction<string>) => {
            state.paymentDetail.data.payment_date = action.payload;
        },
        changeValuePaymentDetails: (state: IFinancialStore, action: PayloadAction<number>) => {
            state.paymentDetail.data.value = action.payload;
        },
        changeVisibleContractsModal: (
            state: IFinancialStore,
            action: PayloadAction<PayloadChangeVisibleModalContractsAction>,
        ) => {
            state.contracts.modal[action.payload.modal].visible = action.payload.visible;
        },
        changeVisibleInvoiceModal: (
            state: IFinancialStore,
            action: PayloadAction<PayloadChangeVisibleModalInvoiceAction>,
        ) => {
            state.invoices.modal[action.payload.modal].visible = action.payload.visible;
        },
        changeVisibleModalContract: (
            state: IFinancialStore,
            action: PayloadAction<PayloadChangeVisibleModalContractAction>,
        ) => {
            state.contractDetail.modal[action.payload.modal].visible = action.payload.visible;
        },
        changeValueMergeModal: (state: IFinancialStore, action: PayloadAction<number[]>) => {
            state.contractDetail.modal.mergeContract.id = action.payload;
        },
        setFilterPayments: (state: IFinancialStore, action) => {
            state.payments.filters = {
                ...state.payments.filters,
                [action.payload.name]: action.payload.value ?? "",
            };
        },
        cleanFilterPayments: (state: IFinancialStore) => {
            state.payments.filters = initialState.payments.filters;
        },
        changeVisibleModalTag: (state: IFinancialStore, action: PayloadAction<PayloadChangeVisibleModalTagsAction>) => {
            state.tags.modal[action.payload.modal].visible = action.payload.visible;
        },
        changeVisibleModalPayoffPayments: (state: IFinancialStore, action: PayloadAction<boolean>) => {
            state.payments.modal.payoff.visible = action.payload;
        },
        changeDataSourcePayoffPayments: (
            state: IFinancialStore,
            action: PayloadAction<IPaymentModalPayoffDataSource[]>,
        ) => {
            state.payments.modal.payoff.data = action.payload;
        },
        changeSingleDataSourcePayoffPayments: (
            state: IFinancialStore,
            action: PayloadAction<IPaymentModalPayoffDataSource>,
        ) => {
            const index = state.payments.modal.payoff.data.findIndex((item) => item.id === action.payload.id);
            state.payments.modal.payoff.data[index] = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllContract.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllContract.fulfilled, (state, action) => {
                state.data = action.payload.response.data.data;
                state.contractDetail.contracts = action.payload.response.data.data;
                state.pagination = {
                    currentPage: action.payload.response.data.current_page,
                    hasNext: action.payload.response.data.has_next,
                    hasPrevious: action.payload.response.data.has_previous,
                    totalPages: action.payload.response.data.total_pages,
                };
                state.filters = action.payload.filters;
                state.loading = false;
            })
    },
});

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
    changeStatusPaymentPagination,
    changeVisibleModalPayoffPayments,
    changeDataSourcePayoffPayments,
    changeSingleDataSourcePayoffPayments,
} = financialSlice.actions;

export default financialSlice.reducer;
