import {
    fetchPaymentReportThunk,
    fetchCountPaymentReportThunk,
    fetchAmountPaymentReportThunk,
    fetchAmountPaymentOpenReportThunk,
    fetchAmountPaymentClosedReportThunk,
    fetchAmountInvoiceByTagReportThunk,
    fetchAmountForecastValueThunk,
} from "./index";
import { apiDjango } from "@/services/index";
import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

// Mock the apiDjango service
jest.mock("@/services/index", () => ({
    apiDjango: {
        get: jest.fn(),
    },
}));

const mockStore = configureStore({
    reducer: () => ({}),
    middleware: [thunk],
});

type AppDispatch = ThunkDispatch<{}, void, AnyAction>;

describe("Financial Overview Thunks", () => {
    let store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        store = mockStore();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("fetchPaymentReportThunk should return data", async () => {
        const mockData = { data: "mockData" };
        (apiDjango.get as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await store.dispatch(fetchPaymentReportThunk() as any);

        expect(apiDjango.get).toHaveBeenCalledWith("/financial/report/");
        expect(result.payload).toEqual(mockData);
    });

    test("fetchCountPaymentReportThunk should return data", async () => {
        const mockData = { data: "mockData" };
        (apiDjango.get as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await store.dispatch(fetchCountPaymentReportThunk() as any);

        expect(apiDjango.get).toHaveBeenCalledWith("/financial/report/count_payment");
        expect(result.payload).toEqual(mockData);
    });

    test("fetchAmountPaymentReportThunk should return data", async () => {
        const mockData = { data: "mockData" };
        (apiDjango.get as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await store.dispatch(fetchAmountPaymentReportThunk() as any);

        expect(apiDjango.get).toHaveBeenCalledWith("/financial/report/amount_payment");
        expect(result.payload).toEqual(mockData);
    });

    test("fetchAmountPaymentOpenReportThunk should return data", async () => {
        const mockData = { data: "mockData" };
        (apiDjango.get as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await store.dispatch(fetchAmountPaymentOpenReportThunk() as any);

        expect(apiDjango.get).toHaveBeenCalledWith("/financial/report/amount_payment_open");
        expect(result.payload).toEqual(mockData);
    });

    test("fetchAmountPaymentClosedReportThunk should return data", async () => {
        const mockData = { data: "mockData" };
        (apiDjango.get as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await store.dispatch(fetchAmountPaymentClosedReportThunk() as any);

        expect(apiDjango.get).toHaveBeenCalledWith("/financial/report/amount_payment_closed");
        expect(result.payload).toEqual(mockData);
    });

    test("fetchAmountInvoiceByTagReportThunk should return data", async () => {
        const mockData = { data: "mockData" };
        (apiDjango.get as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await store.dispatch(fetchAmountInvoiceByTagReportThunk() as any);

        expect(apiDjango.get).toHaveBeenCalledWith("/financial/report/amount_invoice_by_tag");
        expect(result.payload).toEqual(mockData);
    });

    test("fetchAmountForecastValueThunk should return data", async () => {
        const mockData = { data: "mockData" };
        (apiDjango.get as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await store.dispatch(fetchAmountForecastValueThunk() as any);

        expect(apiDjango.get).toHaveBeenCalledWith("/financial/report/amount_forecast_value");
        expect(result.payload).toEqual(mockData);
    });
});
