import { configureStore } from "@reduxjs/toolkit";
import financialReducer, { setFilterPayments, cleanFilterPayments, IPaymentStore } from "./index";

describe("financial slice", () => {
    let store: ReturnType<typeof configureStore>;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                financial: financialReducer,
            },
        });
    });

    test("should set filter payments", () => {
        const initialState: IPaymentStore = {
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
        };

        const expectedState = {
            ...initialState,
            filters: {
                ...initialState.filters,
                page: 2,
            },
        };

        store.dispatch(setFilterPayments({ name: "page", value: 2 }));
        const state = store.getState().financial;
        expect(state.filters).toEqual(expectedState.filters);
    });

    test("should clean filter payments", () => {
        const initialState: IPaymentStore = {
            data: [],
            pagination: {
                currentPage: 1,
                hasNext: false,
                hasPrevious: false,
                totalPages: 1,
            },
            loading: true,
            filters: {
                page: 2,
                page_size: 20,
            },
            modal: {
                payoff: {
                    data: [],
                    visible: false,
                },
            },
        };

        store.dispatch(setFilterPayments({ name: "page", value: 2 }));
        store.dispatch(cleanFilterPayments());
        const state = store.getState().financial;
        expect(state.filters).toEqual(initialState.filters);
    });
});
