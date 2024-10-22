import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import FinancialPage from "./page";
import { RootState } from "@/lib/store";
import { setSelectedMenu, fetchAllContract, changeVisibleContractsModal } from "@/lib/features/financial/contract";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("FinancialPage", () => {
    let store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        const initialState: RootState = {
            financial: {
                contract: {
                    data: [],
                    filters: { page_size: 20 },
                    pagination: { currentPage: 1, totalPages: 1 },
                    loading: false,
                    modal: { newPayment: { visible: false } },
                },
            },
        } as any;

        store = mockStore(initialState);
    });

    test("should render FinancialPage correctly", () => {
        render(
            <Provider store={store}>
                <FinancialPage />
            </Provider>,
        );

        expect(screen.getByText("Kawori")).toBeInTheDocument();
        expect(screen.getByText("Financeiro")).toBeInTheDocument();
        expect(screen.getByText("Em aberto")).toBeInTheDocument();
        expect(screen.getByText("Valores em aberto")).toBeInTheDocument();
    });

    test("should dispatch setSelectedMenu and fetchAllContract on mount", () => {
        render(
            <Provider store={store}>
                <FinancialPage />
            </Provider>,
        );

        const actions = store.getActions();
        expect(actions).toContainEqual(setSelectedMenu(["financial", "contracts"]));
        expect(actions).toContainEqual(fetchAllContract({ page: 1, page_size: 20 }));
    });

    test("should dispatch changeVisibleContractsModal when closeModal is called", () => {
        render(
            <Provider store={store}>
                <FinancialPage />
            </Provider>,
        );

        const closeModalButton = screen.getByText("Detalhes");
        fireEvent.click(closeModalButton);

        const actions = store.getActions();
        expect(actions).toContainEqual(changeVisibleContractsModal({ modal: "newPayment", visible: false }));
    });

    test("should render table with correct columns", () => {
        render(
            <Provider store={store}>
                <FinancialPage />
            </Provider>,
        );

        expect(screen.getByText("Id")).toBeInTheDocument();
        expect(screen.getByText("Nome")).toBeInTheDocument();
        expect(screen.getByText("Total")).toBeInTheDocument();
        expect(screen.getByText("Baixado")).toBeInTheDocument();
        expect(screen.getByText("Em aberto")).toBeInTheDocument();
        expect(screen.getByText("Ações")).toBeInTheDocument();
    });

    test("should handle pagination change", () => {
        render(
            <Provider store={store}>
                <FinancialPage />
            </Provider>,
        );

        const pagination = screen.getByRole("button", { name: /2/i });
        fireEvent.click(pagination);

        const actions = store.getActions();
        expect(actions).toContainEqual(fetchAllContract({ page: 2, page_size: 20 }));
    });
});
