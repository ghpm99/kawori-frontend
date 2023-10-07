import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiDjango } from "services";

export const fetchPaymentReportThunk = createAsyncThunk("financial/fetchPaymentReportThunk", async () => {
    const response = await apiDjango.get("/financial/report/");
    return response;
});

export const fetchCountPaymentReportThunk = createAsyncThunk("financial/fetchCountPaymentReportThunk", async () => {
    const response = await apiDjango.get("/financial/report/count_payment");
    return response;
});

export const fetchAmountPaymentReportThunk = createAsyncThunk("financial/fetchAmountPaymentReportThunk", async () => {
    const response = await apiDjango.get("/financial/report/amount_payment");
    return response;
});

export const fetchAmountPaymentOpenReportThunk = createAsyncThunk(
    "financial/fetchAmountPaymentOpenReportThunk",
    async () => {
        const response = await apiDjango.get("/financial/report/amount_payment_open");
        return response;
    },
);

export const fetchAmountPaymentClosedReportThunk = createAsyncThunk(
    "financial/fetchAmountPaymentClosedReportThunk",
    async () => {
        const response = await apiDjango.get("/financial/report/amount_payment_closed");
        return response;
    },
);

export const fetchAmountInvoiceByTagReportThunk = createAsyncThunk(
    "financial/fetchAmountInvoiceByTagReportThunk",
    async () => {
        const response = await apiDjango.get("/financial/report/amount_invoice_by_tag");
        return response;
    },
);
