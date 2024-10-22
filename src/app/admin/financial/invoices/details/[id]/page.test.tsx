import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import InvoiceDetails from "./page";
import { fetchInvoiceDetails, fetchInvoicePaymentsDetails, fetchTags } from "@/lib/features/financial/invoice/detail";
import { setSelectedMenu } from "@/lib/features/auth";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock("@/lib/features/financial/invoice/detail", () => ({
    fetchInvoiceDetails: jest.fn(),
    fetchInvoicePaymentsDetails: jest.fn(),
    fetchTags: jest.fn(),
}));

jest.mock("@/lib/features/auth", () => ({
    setSelectedMenu: jest.fn(),
}));

describe("InvoiceDetails", () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            financial: {
                invoiceDetail: {
                    loading: false,
                    data: {
                        id: 1,
                        contract: 123,
                        contract_name: "Test Contract",
                        name: "Test Invoice",
                        status: 0,
                        installments: 3,
                        date: "2023-10-01",
                        value: 1000,
                        value_open: 500,
                        value_closed: 500,
                        tags: [{ id: 1, name: "Tag1" }],
                    },
                    payments: {
                        loading: false,
                        data: [],
                        filters: { page_size: 20 },
                        pagination: { currentPage: 1, totalPages: 1 },
                    },
                },
                tag: {
                    data: [
                        { id: 1, name: "Tag1" },
                        { id: 2, name: "Tag2" },
                    ],
                },
            },
        });
    });

    test("renders InvoiceDetails component", () => {
        render(
            <Provider store={store}>
                <InvoiceDetails params={{ id: 1 }} />
            </Provider>,
        );

        expect(screen.getByText("ID: 1")).toBeInTheDocument();
        expect(screen.getByText("Contrato: 123 - Test Contract")).toBeInTheDocument();
        expect(screen.getByText("Nome:")).toBeInTheDocument();
        expect(screen.getByText("Test Invoice")).toBeInTheDocument();
        expect(screen.getByText("Status: Em aberto")).toBeInTheDocument();
        expect(screen.getByText("Parcelas: 3")).toBeInTheDocument();
        expect(screen.getByText("Data: 01/10/2023")).toBeInTheDocument();
        expect(screen.getByText("Valor: $1,000.00")).toBeInTheDocument();
        expect(screen.getByText("Valor em Aberto: $500.00")).toBeInTheDocument();
        expect(screen.getByText("Valor Baixado: $500.00")).toBeInTheDocument();
    });

    test("dispatches actions on mount", () => {
        render(
            <Provider store={store}>
                <InvoiceDetails params={{ id: 1 }} />
            </Provider>,
        );

        expect(setSelectedMenu).toHaveBeenCalledWith(["financial", "invoices"]);
        expect(fetchTags).toHaveBeenCalled();
        expect(fetchInvoiceDetails).toHaveBeenCalledWith(1);
        expect(fetchInvoicePaymentsDetails).toHaveBeenCalledWith({
            id: 1,
            filters: { page: 1, page_size: 20 },
        });
    });

    test("handles tag change", () => {
        render(
            <Provider store={store}>
                <InvoiceDetails params={{ id: 1 }} />
            </Provider>,
        );

        fireEvent.change(screen.getByPlaceholderText("Tags"), { target: { value: [1, 2] } });
        // Add assertions to check if the tag change is handled correctly
    });

    test("handles pagination change", () => {
        render(
            <Provider store={store}>
                <InvoiceDetails params={{ id: 1 }} />
            </Provider>,
        );

        fireEvent.click(screen.getByText("Next"));
        // Add assertions to check if the pagination change is handled correctly
    });
});
