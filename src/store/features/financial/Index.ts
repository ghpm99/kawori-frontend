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

const initialState: IFinancialStore = {
    payments: {
        data: [],
        pagination: {
            currentPage: 1,
            hasNext: false,
            hasPrevious: false,
            totalPages: 1,
        },
        loading: true,
        filters: {
            page: 0,
            page_size: 20,
        },
        modal: {
            payoff: {
                data: [],
                visible: false,
            },
        },
    },
    paymentDetail: {
        data: {
            id: 0,
            status: 0,
            type: 0,
            name: "",
            date: "",
            installments: 0,
            payment_date: "",
            fixed: false,
            active: false,
            value: 0,
            invoice: 0,
            invoice_name: "",
            contract: 0,
            contract_name: "",
        },
        loading: true,
    },
    paymentReport: {
        loading: true,
        data: {
            payments: [],
            open: [],
            closed: [],
            fixed_credit: 0,
            fixed_debit: 0,
            invoiceByTag: [],
            countPayment: 0,
            amountPayment: 0,
            amountPaymentClosed: 0,
            amountPaymentOpen: 0,
        },
    },
    contracts: {
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
        },
    },
    contractDetail: {
        data: {
            id: 0,
            name: "",
            value: 0,
            value_open: 0,
            value_closed: 0,
        },
        invoices: {
            data: [],
            filters: {
                page: 1,
                page_size: 20,
            },
            loading: true,
            pagination: {
                currentPage: 1,
                hasNext: false,
                hasPrevious: false,
                totalPages: 1,
            },
        },
        contracts: [],
        loading: true,
        modal: {
            mergeContract: {
                id: [],
                visible: false,
                error: false,
                errorMsg: "",
            },
            newInvoice: {
                visible: false,
                error: false,
                errorMsg: "",
            },
        },
    },
    invoices: {
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
        },
    },
    invoiceDetail: {
        data: {
            id: 0,
            status: 0,
            name: "",
            installments: 0,
            value: 0,
            value_open: 0,
            value_closed: 0,
            date: "",
            contract: 0,
            contract_name: "",
            tags: [],
        },
        payments: {
            data: [],
            pagination: {
                currentPage: 1,
                hasNext: false,
                hasPrevious: false,
                totalPages: 1,
            },
            filters: {
                page: 1,
                page_size: 20,
            },
            loading: true,
        },
        loading: true,
    },
    tags: {
        data: [],
        loading: true,
        modal: {
            newTag: {
                visible: false,
                error: false,
                errorMsg: "",
            },
        },
    },
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

export const financialSlice = createSlice({
    name: "financial",
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
            .addCase(fetchAllPayment.pending, (state) => {
                state.payments.loading = true;
            })
            .addCase(fetchAllPayment.fulfilled, (state, action) => {
                state.payments.filters = action.payload.filters;
                state.payments.data = action.payload.response.data.data.map((data: any) => ({
                    ...data,
                    key: data.id,
                }));
                state.payments.pagination.currentPage = action.payload.response.data.current_page;
                state.payments.pagination.hasNext = action.payload.response.data.has_next;
                state.payments.pagination.hasPrevious = action.payload.response.data.has_previous;
                state.payments.pagination.totalPages = action.payload.response.data.total_pages;
                state.payments.loading = false;
            })
            .addCase(saveNewPayment.fulfilled, (state, action) => {
                state.payments.data.push(action.payload);
            })
            .addCase(fetchPaymentDetails.pending, (state) => {
                state.paymentDetail.loading = true;
            })
            .addCase(fetchPaymentDetails.fulfilled, (state, action) => {
                state.paymentDetail.data = action.payload.data;
                state.paymentDetail.loading = false;
            })
            .addCase(fetchPaymentReport.pending, (state) => {
                state.paymentReport.loading = true;
            })
            .addCase(fetchPaymentReport.fulfilled, (state, action) => {
                state.paymentReport.data = action.payload.charts.data;
                state.paymentReport.data.countPayment = action.payload.count.data;
                state.paymentReport.data.amountPayment = action.payload.amount.data;
                state.paymentReport.data.amountPaymentOpen = action.payload.amountOpen.data;
                state.paymentReport.data.amountPaymentClosed = action.payload.amountClosed.data;
                state.paymentReport.data.invoiceByTag = action.payload.amountByTag.data;
                state.paymentReport.loading = false;
            })
            .addCase(fetchAllContract.pending, (state) => {
                state.contracts.loading = true;
            })
            .addCase(fetchAllContract.fulfilled, (state, action) => {
                state.contracts.data = action.payload.response.data.data;
                state.contractDetail.contracts = action.payload.response.data.data;
                state.contracts.pagination = {
                    currentPage: action.payload.response.data.current_page,
                    hasNext: action.payload.response.data.has_next,
                    hasPrevious: action.payload.response.data.has_previous,
                    totalPages: action.payload.response.data.total_pages,
                };
                state.contracts.filters = action.payload.filters;
                state.contracts.loading = false;
            })
            .addCase(fetchAllInvoice.pending, (state) => {
                state.invoices.loading = true;
            })
            .addCase(fetchAllInvoice.fulfilled, (state, action) => {
                state.invoices.data = action.payload.response.data.data;
                state.invoices.pagination = {
                    currentPage: action.payload.response.data.current_page,
                    hasNext: action.payload.response.data.has_next,
                    hasPrevious: action.payload.response.data.has_previous,
                    totalPages: action.payload.response.data.total_pages,
                };
                state.invoices.filters = action.payload.filters;
                state.invoices.loading = false;
            })
            .addCase(fetchContractDetails.pending, (state) => {
                state.contractDetail.loading = true;
            })
            .addCase(fetchContractDetails.fulfilled, (state, action) => {
                state.contractDetail.data = action.payload.data;
                state.contractDetail.loading = false;
            })
            .addCase(fetchInvoiceDetails.pending, (state) => {
                state.invoiceDetail.loading = true;
            })
            .addCase(fetchInvoiceDetails.fulfilled, (state, action) => {
                state.invoiceDetail.data = action.payload.data;
                state.invoiceDetail.loading = false;
            })
            .addCase(fetchTags.pending, (state) => {
                state.tags.loading = true;
            })
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.tags.data = action.payload.data;
                state.tags.loading = false;
            })
            .addCase(fetchContractInvoicesDetails.pending, (state) => {
                state.contractDetail.invoices.loading = true;
            })
            .addCase(fetchContractInvoicesDetails.fulfilled, (state, action) => {
                state.contractDetail.invoices.data = action.payload.response.data.data;
                state.contractDetail.invoices.pagination = {
                    currentPage: action.payload.response.data.current_page,
                    hasNext: action.payload.response.data.has_next,
                    hasPrevious: action.payload.response.data.has_previous,
                    totalPages: action.payload.response.data.total_pages,
                };
                state.contractDetail.invoices.filters = action.payload.filters;
                state.contractDetail.invoices.loading = false;
            })
            .addCase(fetchContractInvoicesDetails.rejected, (state) => {
                state.contractDetail.invoices.loading = false;
            })
            .addCase(fetchInvoicePaymentsDetails.pending, (state) => {
                state.invoiceDetail.payments.loading = true;
            })
            .addCase(fetchInvoicePaymentsDetails.fulfilled, (state, action) => {
                state.invoiceDetail.payments.data = action.payload.response.data.data;
                state.invoiceDetail.payments.pagination = {
                    currentPage: action.payload.response.data.current_page,
                    hasNext: action.payload.response.data.has_next,
                    hasPrevious: action.payload.response.data.has_previous,
                    totalPages: action.payload.response.data.total_pages,
                };
                state.invoiceDetail.payments.filters = action.payload.filters;
                state.invoiceDetail.payments.loading = false;
            })
            .addCase(fetchInvoicePaymentsDetails.rejected, (state) => {
                state.invoiceDetail.payments.loading = false;
            });
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
