import { configureStore } from "@reduxjs/toolkit";
import financialOverviewReducer, { financialOverviewSlice } from "./index";
import { fetchMonthPayments } from "../payment";

import {
    fetchAmountForecastValueThunk,
    fetchAmountInvoiceByTagReportThunk,
    fetchAmountPaymentClosedReportThunk,
    fetchAmountPaymentOpenReportThunk,
    fetchAmountPaymentReportThunk,
    fetchCountPaymentReportThunk,
    fetchPaymentReportThunk,
} from "@/services/financial/overview";

describe("financialOverviewSlice", () => {
    const initialState = {
        loading: true,
        data: {
            payments: [],
            fixed_credit: 0,
            fixed_debit: 0,
            invoiceByTag: [],
            countPayment: 0,
            amountPayment: 0,
            amountPaymentClosed: 0,
            amountPaymentOpen: 0,
            amountForecastValue: 0,
            month: [],
        },
    };

    const store = configureStore({
        reducer: {
            overview: financialOverviewReducer,
        },
    });

    test("should handle fetchPaymentReportThunk.pending", () => {
        store.dispatch(fetchPaymentReportThunk.pending);
        const state = store.getState().overview;
        expect(state.loading).toBe(true);
    });

    test("should handle fetchPaymentReportThunk.fulfilled", () => {
        const payload = {
            data: {
                payments: [{ id: 1, amount: 100 }],
                fixed_debit: 50,
                fixed_credit: 150,
            },
        };
        store.dispatch(fetchPaymentReportThunk.fulfilled(payload, ""));
        const state = store.getState().overview;
        expect(state.data.payments).toEqual(payload.data.payments);
        expect(state.data.fixed_debit).toBe(payload.data.fixed_debit);
        expect(state.data.fixed_credit).toBe(payload.data.fixed_credit);
        expect(state.loading).toBe(false);
    });

    test("should handle fetchCountPaymentReportThunk.fulfilled", () => {
        const payload = { data: 10 };
        store.dispatch(fetchCountPaymentReportThunk.fulfilled(payload, ""));
        const state = store.getState().overview;
        expect(state.data.countPayment).toBe(payload.data);
    });

    test("should handle fetchAmountPaymentReportThunk.fulfilled", () => {
        const payload = { data: 200 };
        store.dispatch(fetchAmountPaymentReportThunk.fulfilled(payload, ""));
        const state = store.getState().overview;
        expect(state.data.amountPayment).toBe(payload.data);
    });

    test("should handle fetchAmountPaymentOpenReportThunk.fulfilled", () => {
        const payload = { data: 300 };
        store.dispatch(fetchAmountPaymentOpenReportThunk.fulfilled(payload, ""));
        const state = store.getState().overview;
        expect(state.data.amountPaymentOpen).toBe(payload.data);
    });

    test("should handle fetchAmountPaymentClosedReportThunk.fulfilled", () => {
        const payload = { data: 400 };
        store.dispatch(fetchAmountPaymentClosedReportThunk.fulfilled(payload, ""));
        const state = store.getState().overview;
        expect(state.data.amountPaymentClosed).toBe(payload.data);
    });

    test("should handle fetchAmountInvoiceByTagReportThunk.fulfilled", () => {
        const payload = { data: [{ tag: "food", amount: 100 }] };
        store.dispatch(fetchAmountInvoiceByTagReportThunk.fulfilled(payload, ""));
        const state = store.getState().overview;
        expect(state.data.invoiceByTag).toEqual(payload.data);
    });

    test("should handle fetchAmountForecastValueThunk.fulfilled", () => {
        const payload = { data: 500 };
        store.dispatch(fetchAmountForecastValueThunk.fulfilled(payload, ""));
        const state = store.getState().overview;
        expect(state.data.amountForecastValue).toBe(payload.data);
    });

    test("should handle fetchMonthPayments.fulfilled", () => {
        const payload = { data: [{ month: "January", payments: [] }] };
        store.dispatch(fetchMonthPayments.fulfilled(payload, ""));
        const state = store.getState().overview;
        expect(state.data.month).toEqual(payload.data);
    });
});
