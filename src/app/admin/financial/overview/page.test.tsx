import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import OverviewReport from "./page";
import { RootState } from "@/lib/store";

const mockStore = configureStore([]);

describe("OverviewReport", () => {
    let store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        const initialState: RootState = {
            financial: {
                overview: {
                    data: {
                        countPayment: 10,
                        amountPayment: 1000,
                        amountPaymentOpen: 500,
                        amountPaymentClosed: 500,
                        month: [],
                        payments: [],
                        invoiceByTag: [],
                        amountForecastValue: 2000,
                        fixed_credit: 300,
                        fixed_debit: 200,
                    },
                    loading: false,
                },
            },
        };
        store = mockStore(initialState);
    });

    test("renders Cards component with correct props", () => {
        render(
            <Provider store={store}>
                <OverviewReport />
            </Provider>,
        );

        expect(screen.getByText("10")).toBeInTheDocument();
        expect(screen.getByText("1000")).toBeInTheDocument();
        expect(screen.getByText("500")).toBeInTheDocument();
    });

    test("renders Table component with correct props", () => {
        render(
            <Provider store={store}>
                <OverviewReport />
            </Provider>,
        );

        expect(screen.getByRole("table")).toBeInTheDocument();
    });

    test("renders PaymentWithFixed component", () => {
        render(
            <Provider store={store}>
                <OverviewReport />
            </Provider>,
        );

        expect(screen.getByText("PaymentWithFixed")).toBeInTheDocument();
    });

    test("renders InvoiceByTag component", () => {
        render(
            <Provider store={store}>
                <OverviewReport />
            </Provider>,
        );

        expect(screen.getByText("InvoiceByTag")).toBeInTheDocument();
    });

    test("renders AccumulatedValue component", () => {
        render(
            <Provider store={store}>
                <OverviewReport />
            </Provider>,
        );

        expect(screen.getByText("AccumulatedValue")).toBeInTheDocument();
    });

    test("renders PaymentFixed component", () => {
        render(
            <Provider store={store}>
                <OverviewReport />
            </Provider>,
        );

        expect(screen.getByText("PaymentFixed")).toBeInTheDocument();
    });
});
