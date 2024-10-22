import { configureStore } from "@reduxjs/toolkit";
import { fetchAllContractService } from "@/services/financial";
import { IContractStore, IContractFilters, PayloadChangeVisibleModalContractsAction } from "./types";

import contractReducer, { fetchAllContract, changeVisibleContractsModal } from "./index";

jest.mock("@/services/financial");

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
    },
};

describe("contractSlice", () => {
    let store: ReturnType<typeof configureStore>;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                contract: contractReducer,
            },
        });
    });

    it("should handle initial state", () => {
        expect(store.getState().contract).toEqual(initialState);
    });

    it("should handle changeVisibleContractsModal", () => {
        store.dispatch(
            changeVisibleContractsModal({
                modal: "newPayment",
                visible: true,
            } as PayloadChangeVisibleModalContractsAction),
        );
        expect(store.getState().contract.modal.newPayment.visible).toBe(true);
    });

    it("should handle fetchAllContract pending", () => {
        store.dispatch(fetchAllContract.pending("", {} as IContractFilters));
        expect(store.getState().contract.loading).toBe(true);
    });

    it("should handle fetchAllContract fulfilled", async () => {
        const mockResponse = {
            data: {
                data: [{ id: 1, name: "Contract 1" }],
                current_page: 1,
                has_next: false,
                has_previous: false,
                total_pages: 1,
            },
        };
        (fetchAllContractService as jest.Mock).mockResolvedValue(mockResponse);

        await store.dispatch(fetchAllContract({ page: 1, page_size: 20 } as IContractFilters));
        const state = store.getState().contract;

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
