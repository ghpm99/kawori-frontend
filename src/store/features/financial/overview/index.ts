import { createSlice } from "@reduxjs/toolkit";

import {
    fetchAmountInvoiceByTagReportThunk,
    fetchAmountPaymentClosedReportThunk,
    fetchAmountPaymentOpenReportThunk,
    fetchAmountPaymentReportThunk,
    fetchCountPaymentReportThunk,
    fetchPaymentReportThunk,
} from "services/financial/overview";

const initialState: IOverviewStore = {
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
};

export const financialOverviewSlice = createSlice({
    name: "overview",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPaymentReportThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPaymentReportThunk.fulfilled, (state, action) => {
                state.data = action.payload.data;
                state.loading = false;
            })
            .addCase(fetchCountPaymentReportThunk.fulfilled, (state, action) => {
                state.data.countPayment = action.payload.data;
            })
            .addCase(fetchAmountPaymentReportThunk.fulfilled, (state, action) => {
                state.data.amountPayment = action.payload.data;
            })
            .addCase(fetchAmountPaymentOpenReportThunk.fulfilled, (state, action) => {
                state.data.amountPaymentOpen = action.payload.data;
            })
            .addCase(fetchAmountPaymentClosedReportThunk.fulfilled, (state, action) => {
                state.data.amountPaymentClosed = action.payload.data;
            })
            .addCase(fetchAmountInvoiceByTagReportThunk.fulfilled, (state, action) => {
                state.data.invoiceByTag = action.payload.data;
            });
    },
});

export default financialOverviewSlice.reducer;
