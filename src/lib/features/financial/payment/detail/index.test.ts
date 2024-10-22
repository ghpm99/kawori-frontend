import { configureStore } from "@reduxjs/toolkit";
import { fetchDetailPaymentService } from "@/services/financial";

import financialReducer, {
    changeStatusPaymentDetails,
    changeNamePaymentDetails,
    changeTypePaymentDetails,
    changeFixedPaymentDetails,
    changeActivePaymentDetails,
    changePaymentDatePaymentDetails,
    changeValuePaymentDetails,
    fetchPaymentDetails,
} from "./index";

jest.mock("@/services/financial");

const initialState = {
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
};

describe("financialSlice", () => {
    let store: ReturnType<typeof configureStore>;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                financial: financialReducer,
            },
        });
    });

    test("should handle initial state", () => {
        expect(store.getState().financial).toEqual(initialState);
    });

    test("should handle changeStatusPaymentDetails", () => {
        store.dispatch(changeStatusPaymentDetails(1));
        expect(store.getState().financial.data.status).toEqual(1);
    });

    test("should handle changeNamePaymentDetails", () => {
        store.dispatch(changeNamePaymentDetails("Test Name"));
        expect(store.getState().financial.data.name).toEqual("Test Name");
    });

    test("should handle changeTypePaymentDetails", () => {
        store.dispatch(changeTypePaymentDetails(2));
        expect(store.getState().financial.data.type).toEqual(2);
    });

    test("should handle changeFixedPaymentDetails", () => {
        store.dispatch(changeFixedPaymentDetails(true));
        expect(store.getState().financial.data.fixed).toEqual(true);
    });

    test("should handle changeActivePaymentDetails", () => {
        store.dispatch(changeActivePaymentDetails(true));
        expect(store.getState().financial.data.active).toEqual(true);
    });

    test("should handle changePaymentDatePaymentDetails", () => {
        store.dispatch(changePaymentDatePaymentDetails("2023-10-01"));
        expect(store.getState().financial.data.payment_date).toEqual("2023-10-01");
    });

    test("should handle changeValuePaymentDetails", () => {
        store.dispatch(changeValuePaymentDetails(1000));
        expect(store.getState().financial.data.value).toEqual(1000);
    });

    test("should handle fetchPaymentDetails pending", () => {
        store.dispatch(fetchPaymentDetails.pending);
        expect(store.getState().financial.loading).toEqual(true);
    });

    test("should handle fetchPaymentDetails fulfilled", async () => {
        const mockResponse = {
            data: {
                id: 1,
                status: 1,
                type: 1,
                name: "Test Payment",
                date: "2023-10-01",
                installments: 1,
                payment_date: "2023-10-01",
                fixed: true,
                active: true,
                value: 1000,
                invoice: 1,
                invoice_name: "Test Invoice",
                contract: 1,
                contract_name: "Test Contract",
            },
        };

        (fetchDetailPaymentService as jest.Mock).mockResolvedValue(mockResponse);

        await store.dispatch(fetchPaymentDetails(1));
        expect(store.getState().financial.data).toEqual(mockResponse.data);
        expect(store.getState().financial.loading).toEqual(false);
    });
});
