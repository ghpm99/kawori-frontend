import { configureStore } from "@reduxjs/toolkit";
import {
    fetchAllContract,
    fetchContractDetails,
    fetchContractInvoicesDetails,
    changeVisibleModalContract,
    changeValueMergeModal,
} from "./index";
import contractDetailReducer, {
    fetchAllContractService,
    fetchDetailContractService,
    fetchDetailContractInvoicesService,
} from "@/services/financial";

jest.mock("@/services/financial");

const initialState = {
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
};

describe("contractDetailSlice", () => {
    let store: ReturnType<typeof configureStore>;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                contractDetail: contractDetailReducer,
            },
        });
    });

    it("should handle initial state", () => {
        expect(store.getState().contractDetail).toEqual(initialState);
    });

    it("should handle changeVisibleModalContract", () => {
        store.dispatch(changeVisibleModalContract({ modal: "newInvoice", visible: true }));
        expect(store.getState().contractDetail.modal.newInvoice.visible).toBe(true);
    });

    it("should handle changeValueMergeModal", () => {
        store.dispatch(changeValueMergeModal([1, 2, 3]));
        expect(store.getState().contractDetail.modal.mergeContract.id).toEqual([1, 2, 3]);
    });

    it("should handle fetchAllContract fulfilled", async () => {
        const mockResponse = { data: { data: [{ id: 1, name: "Contract 1" }] } };
        (fetchAllContractService as jest.Mock).mockResolvedValue(mockResponse);

        await store.dispatch(fetchAllContract({ page: 1, page_size: 20 }));
        expect(store.getState().contractDetail.contracts).toEqual(mockResponse.data.data);
    });

    it("should handle fetchContractDetails pending and fulfilled", async () => {
        const mockResponse = { data: { id: 1, name: "Contract 1" } };
        (fetchDetailContractService as jest.Mock).mockResolvedValue(mockResponse);

        store.dispatch(fetchContractDetails(1));
        expect(store.getState().contractDetail.loading).toBe(true);

        await store.dispatch(fetchContractDetails(1));
        expect(store.getState().contractDetail.data).toEqual(mockResponse.data);
        expect(store.getState().contractDetail.loading).toBe(false);
    });

    it("should handle fetchContractInvoicesDetails pending and fulfilled", async () => {
        const mockResponse = {
            data: {
                data: [{ id: 1, amount: 100 }],
                current_page: 1,
                has_next: false,
                has_previous: false,
                total_pages: 1,
            },
        };
        (fetchDetailContractInvoicesService as jest.Mock).mockResolvedValue(mockResponse);

        store.dispatch(fetchContractInvoicesDetails({ id: 1, filters: { page: 1, page_size: 20 } }));
        expect(store.getState().contractDetail.invoices.loading).toBe(true);

        await store.dispatch(fetchContractInvoicesDetails({ id: 1, filters: { page: 1, page_size: 20 } }));
        expect(store.getState().contractDetail.invoices.data).toEqual(mockResponse.data.data);
        expect(store.getState().contractDetail.invoices.pagination).toEqual({
            currentPage: mockResponse.data.current_page,
            hasNext: mockResponse.data.has_next,
            hasPrevious: mockResponse.data.has_previous,
            totalPages: mockResponse.data.total_pages,
        });
        expect(store.getState().contractDetail.invoices.loading).toBe(false);
    });

    it("should handle fetchContractInvoicesDetails rejected", async () => {
        (fetchDetailContractInvoicesService as jest.Mock).mockRejectedValue(new Error("Failed to fetch"));

        await store.dispatch(fetchContractInvoicesDetails({ id: 1, filters: { page: 1, page_size: 20 } }));
        expect(store.getState().contractDetail.invoices.loading).toBe(false);
    });
});
