import { configureStore } from "@reduxjs/toolkit";
import financialReducer, { fetchAllInvoice, changeVisibleInvoiceModal } from "./index";
import { fetchAllInvoiceService } from "@/services/financial";
import { IInvoiceStore, IInvoiceFilters, PayloadChangeVisibleModalInvoiceAction } from "@/types";

jest.mock("@/services/financial");

const initialState: IInvoiceStore = {
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

    it("should handle initial state", () => {
        expect(store.getState().financial).toEqual(initialState);
    });

    it("should handle changeVisibleInvoiceModal", () => {
        const payload: PayloadChangeVisibleModalInvoiceAction = {
            modal: "newPayment",
            visible: true,
        };
        store.dispatch(changeVisibleInvoiceModal(payload));
        expect(store.getState().financial.modal.newPayment.visible).toBe(true);
    });

    it("should handle fetchAllInvoice pending", () => {
        store.dispatch(fetchAllInvoice.pending("", {} as IInvoiceFilters));
        expect(store.getState().financial.loading).toBe(true);
    });

    it("should handle fetchAllInvoice fulfilled", async () => {
        const mockResponse = {
            data: {
                data: [{ id: 1, name: "Invoice 1" }],
                current_page: 1,
                has_next: false,
                has_previous: false,
                total_pages: 1,
            },
        };
        (fetchAllInvoiceService as jest.Mock).mockResolvedValue(mockResponse);

        await store.dispatch(fetchAllInvoice({ page: 1, page_size: 20 } as IInvoiceFilters));
        const state = store.getState().financial;

        expect(state.data).toEqual(mockResponse.data.data);
        expect(state.pagination).toEqual({
            currentPage: mockResponse.data.current_page,
            hasNext: mockResponse.data.has_next,
            hasPrevious: mockResponse.data.has_previous,
            totalPages: mockResponse.data.total_pages,
        });
        expect(state.filters).toEqual({ page: 1, page_size: 20 });
        expect(state.loading).toBe(false);
    });
});
