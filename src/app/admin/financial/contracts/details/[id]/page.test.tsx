import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import ContractDetails from "./page";
import {
    fetchContractDetails,
    fetchContractInvoicesDetails,
    fetchAllContract,
    fetchTags,
} from "@/lib/features/financial/contract/detail";
import { setSelectedMenu } from "@/lib/features/auth";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock("@/lib/features/financial/contract/detail", () => ({
    fetchContractDetails: jest.fn(),
    fetchContractInvoicesDetails: jest.fn(),
    fetchAllContract: jest.fn(),
    fetchTags: jest.fn(),
}));

jest.mock("@/lib/features/auth", () => ({
    setSelectedMenu: jest.fn(),
}));

describe("ContractDetails", () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            financial: {
                contractDetail: {
                    loading: false,
                    data: {
                        id: 1,
                        name: "Test Contract",
                        value: 1000,
                        value_closed: 500,
                        value_open: 500,
                        invoices: {
                            filters: { page_size: 20 },
                            pagination: { currentPage: 1, totalPages: 1 },
                            data: [],
                            loading: false,
                        },
                        modal: {
                            newInvoice: { visible: false },
                            mergeContract: { visible: false, id: [] },
                        },
                        contracts: [],
                    },
                },
                tag: {
                    data: [],
                },
            },
        });
    });

    test("renders contract details correctly", () => {
        render(
            <Provider store={store}>
                <ContractDetails params={{ id: 1 }} />
            </Provider>,
        );

        expect(screen.getByText("ID: 1")).toBeInTheDocument();
        expect(screen.getByText("Nome:")).toBeInTheDocument();
        expect(screen.getByText("Test Contract")).toBeInTheDocument();
        expect(screen.getByText("Valor Total: $1,000.00")).toBeInTheDocument();
        expect(screen.getByText("Valor Baixado: $500.00")).toBeInTheDocument();
        expect(screen.getByText("Valor em Aberto: $500.00")).toBeInTheDocument();
    });

    test("dispatches actions on mount", () => {
        render(
            <Provider store={store}>
                <ContractDetails params={{ id: 1 }} />
            </Provider>,
        );

        expect(fetchContractDetails).toHaveBeenCalledWith(1);
        expect(fetchContractInvoicesDetails).toHaveBeenCalledWith({
            id: 1,
            filters: { page: 1, page_size: 20 },
        });
        expect(setSelectedMenu).toHaveBeenCalledWith(["financial", "contracts"]);
        expect(fetchAllContract).toHaveBeenCalledWith({ page: 1, page_size: 100 });
        expect(fetchTags).toHaveBeenCalled();
    });

    test("opens new invoice modal on menu click", () => {
        render(
            <Provider store={store}>
                <ContractDetails params={{ id: 1 }} />
            </Provider>,
        );

        fireEvent.click(screen.getByText("Salvar"));
        fireEvent.click(screen.getByText("Incluir nova nota"));

        const actions = store.getActions();
        expect(actions).toContainEqual({
            type: "financial/contract/changeVisibleModalContract",
            payload: { modal: "newInvoice", visible: true },
        });
    });

    test("opens merge contract modal on menu click", () => {
        render(
            <Provider store={store}>
                <ContractDetails params={{ id: 1 }} />
            </Provider>,
        );

        fireEvent.click(screen.getByText("Salvar"));
        fireEvent.click(screen.getByText("Mesclar contrato"));

        const actions = store.getActions();
        expect(actions).toContainEqual({
            type: "financial/contract/changeVisibleModalContract",
            payload: { modal: "mergeContract", visible: true },
        });
    });
});
