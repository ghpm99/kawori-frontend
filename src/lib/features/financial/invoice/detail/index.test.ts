import { configureStore } from "@reduxjs/toolkit";
import { fetchDetailInvoiceService, fetchDetailInvoicePaymentsService } from "@/services/financial";
import thunk from "redux-thunk";
import { AnyAction } from "redux";
import { IInvoiceDetailStore } from "@/types"; // Adjust the import according to your project structure

import financialReducer, { fetchInvoiceDetails, fetchInvoicePaymentsDetails } from "./index";

jest.mock("@/services/financial");

const mockStore = configureStore({
    reducer: {
        financial: financialReducer,
    },
    middleware: [thunk],
});

describe("financialSlice", () => {
    let store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        store = mockStore();
    });

    test("should handle initial state", () => {
        const state = store.getState().financial;
        expect(state).toEqual({
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
        });
    });

    test("should handle fetchInvoiceDetails.pending", () => {
        store.dispatch(fetchInvoiceDetails.pending("", 1) as AnyAction);
        const state = store.getState().financial;
        expect(state.loading).toBe(true);
    });

    test("should handle fetchInvoiceDetails.fulfilled", async () => {
        const mockResponse = {
            data: {
                id: 1,
                status: 1,
                name: "Test Invoice",
                installments: 3,
                value: 1000,
                value_open: 500,
                value_closed: 500,
                date: "2023-01-01",
                contract: 1,
                contract_name: "Test Contract",
                tags: ["test"],
            },
        };
        (fetchDetailInvoiceService as jest.Mock).mockResolvedValue(mockResponse);

        await store.dispatch(fetchInvoiceDetails(1) as any);
        const state = store.getState().financial;
        expect(state.data).toEqual(mockResponse.data);
        expect(state.loading).toBe(false);
    });

    test("should handle fetchInvoicePaymentsDetails.pending", () => {
        store.dispatch(
            fetchInvoicePaymentsDetails.pending("", { id: 1, filters: { page: 1, page_size: 20 } }) as AnyAction,
        );
        const state = store.getState().financial;
        expect(state.payments.loading).toBe(true);
    });

    test("should handle fetchInvoicePaymentsDetails.fulfilled", async () => {
        const mockResponse = {
            data: {
                data: [{ id: 1, amount: 100 }],
                current_page: 1,
                has_next: false,
                has_previous: false,
                total_pages: 1,
            },
        };
        const filters = { page: 1, page_size: 20 };
        (fetchDetailInvoicePaymentsService as jest.Mock).mockResolvedValue(mockResponse);

        await store.dispatch(fetchInvoicePaymentsDetails({ id: 1, filters }) as any);
        const state = store.getState().financial;
        expect(state.payments.data).toEqual(mockResponse.data.data);
        expect(state.payments.pagination).toEqual({
            currentPage: mockResponse.data.current_page,
            hasNext: mockResponse.data.has_next,
            hasPrevious: mockResponse.data.has_previous,
            totalPages: mockResponse.data.total_pages,
        });
        expect(state.payments.filters).toEqual(filters);
        expect(state.payments.loading).toBe(false);
    });

    test("should handle fetchInvoicePaymentsDetails.rejected", () => {
        store.dispatch(
            fetchInvoicePaymentsDetails.rejected(null, "", { id: 1, filters: { page: 1, page_size: 20 } }) as AnyAction,
        );
        const state = store.getState().financial;
        expect(state.payments.loading).toBe(false);
    });
});
