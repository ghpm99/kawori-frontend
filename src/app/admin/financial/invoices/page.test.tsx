import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import FinancialPage from "./page";
import { fetchAllInvoice, setSelectedMenu } from "@/lib/features/financial/invoice";
import { RootState } from "@/lib/store";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("FinancialPage", () => {
    let store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        store = mockStore({
            financial: {
                invoice: {
                    filters: { page_size: 20 },
                    pagination: { currentPage: 1, totalPages: 1 },
                    data: [],
                    loading: false,
                },
            },
        });

        store.dispatch = jest.fn();
    });

    test("should render FinancialPage and dispatch initial actions", () => {
        render(
            <Provider store={store}>
                <FinancialPage />
            </Provider>,
        );

        expect(document.title).toBe("Kawori Notas");
        expect(store.dispatch).toHaveBeenCalledWith(setSelectedMenu(["financial", "invoices"]));
        expect(store.dispatch).toHaveBeenCalledWith(
            fetchAllInvoice({
                page: 1,
                page_size: 20,
                status: 0,
            }),
        );
    });

    test("should render the table with correct columns", () => {
        render(
            <Provider store={store}>
                <FinancialPage />
            </Provider>,
        );

        const columnHeaders = ["Id", "Nome", "Valor", "Baixado", "Em aberto", "Parcelas", "Dia", "Tags", "Ações"];
        columnHeaders.forEach((header) => {
            expect(screen.getByText(header)).toBeInTheDocument();
        });
    });

    test("should handle pagination change", () => {
        render(
            <Provider store={store}>
                <FinancialPage />
            </Provider>,
        );

        const pagination = screen.getByRole("button", { name: /2/i });
        fireEvent.click(pagination);

        expect(store.dispatch).toHaveBeenCalledWith(
            fetchAllInvoice({
                page: 2,
                page_size: 20,
                ...store.getState().financial.invoice.filters,
            }),
        );
    });

    test("should render loading state", () => {
        store = mockStore({
            financial: {
                invoice: {
                    filters: { page_size: 20 },
                    pagination: { currentPage: 1, totalPages: 1 },
                    data: [],
                    loading: true,
                },
            },
        });

        render(
            <Provider store={store}>
                <FinancialPage />
            </Provider>,
        );

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
});
