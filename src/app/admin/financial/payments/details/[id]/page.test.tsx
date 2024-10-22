import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import PaymentDetails from "./page";
import { RootState } from "@/lib/store";
import dayjs from "dayjs";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("PaymentDetails", () => {
    let store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        const initialState: RootState = {
            financial: {
                paymentDetail: {
                    loading: false,
                    data: {
                        id: 1,
                        contract: 123,
                        contract_name: "Contract Name",
                        invoice: 456,
                        invoice_name: "Invoice Name",
                        name: "Payment Name",
                        date: new Date().toISOString(),
                        payment_date: new Date().toISOString(),
                        status: 0,
                        type: 0,
                        installments: 12,
                        value: 1000,
                        fixed: false,
                        active: true,
                    },
                },
            },
        };
        store = mockStore(initialState);
    });

    test("should render PaymentDetails component", () => {
        render(
            <Provider store={store}>
                <PaymentDetails params={{ id: 1 }} />
            </Provider>,
        );

        expect(screen.getByText("Kawori")).toBeInTheDocument();
        expect(screen.getByText("Financeiro")).toBeInTheDocument();
        expect(screen.getByText("Pagamento")).toBeInTheDocument();
        expect(screen.getByText("Detalhes")).toBeInTheDocument();
        expect(screen.getByText("ID: 1")).toBeInTheDocument();
        expect(screen.getByText("Contrato: 123 - Contract Name")).toBeInTheDocument();
        expect(screen.getByText("Nota: 456 - Invoice Name")).toBeInTheDocument();
        expect(screen.getByText("Nome:")).toBeInTheDocument();
        expect(screen.getByText("Dia de lançamento:")).toBeInTheDocument();
        expect(screen.getByText("Dia de pagamento:")).toBeInTheDocument();
        expect(screen.getByText("Status:")).toBeInTheDocument();
        expect(screen.getByText("Tipo:")).toBeInTheDocument();
        expect(screen.getByText("Parcelas:")).toBeInTheDocument();
        expect(screen.getByText("Valor:")).toBeInTheDocument();
        expect(screen.getByText("Fixo")).toBeInTheDocument();
        expect(screen.getByText("Ativo")).toBeInTheDocument();
    });

    test("should call save function when save button is clicked", () => {
        render(
            <Provider store={store}>
                <PaymentDetails params={{ id: 1 }} />
            </Provider>,
        );

        const saveButton = screen.getByText("Salvar");
        fireEvent.click(saveButton);

        // Add your assertions for the save function here
    });

    test("should call payoff function when payoff button is clicked", () => {
        render(
            <Provider store={store}>
                <PaymentDetails params={{ id: 1 }} />
            </Provider>,
        );

        const payoffButton = screen.getByText("Baixar pagamento");
        fireEvent.click(payoffButton);

        // Add your assertions for the payoff function here
    });

    test("should change name when editable paragraph is changed", () => {
        render(
            <Provider store={store}>
                <PaymentDetails params={{ id: 1 }} />
            </Provider>,
        );

        const nameParagraph = screen.getByText("Payment Name");
        fireEvent.click(nameParagraph);
        fireEvent.change(nameParagraph, { target: { value: "New Payment Name" } });

        // Add your assertions for the changeName function here
    });

    test("should change type when select is changed", () => {
        render(
            <Provider store={store}>
                <PaymentDetails params={{ id: 1 }} />
            </Provider>,
        );

        const typeSelect = screen.getByPlaceholderText("Selecione o tipo de entrada");
        fireEvent.change(typeSelect, { target: { value: 1 } });

        // Add your assertions for the changeType function here
    });

    test("should change payment date when date picker is changed", () => {
        render(
            <Provider store={store}>
                <PaymentDetails params={{ id: 1 }} />
            </Provider>,
        );

        const datePicker = screen.getByPlaceholderText("Selecione a data");
        fireEvent.change(datePicker, { target: { value: dayjs().format("DD/MM/YYYY") } });

        // Add your assertions for the changePaymentDate function here
    });

    test("should change value when input number is changed", () => {
        render(
            <Provider store={store}>
                <PaymentDetails params={{ id: 1 }} />
            </Provider>,
        );

        const inputNumber = screen.getByDisplayValue(1000);
        fireEvent.change(inputNumber, { target: { value: 2000 } });

        // Add your assertions for the changeValue function here
    });

    test("should change fixed when checkbox is changed", () => {
        render(
            <Provider store={store}>
                <PaymentDetails params={{ id: 1 }} />
            </Provider>,
        );

        const fixedCheckbox = screen.getByLabelText("Fixo");
        fireEvent.click(fixedCheckbox);

        // Add your assertions for the changeFixed function here
    });

    test("should change active when checkbox is changed", () => {
        render(
            <Provider store={store}>
                <PaymentDetails params={{ id: 1 }} />
            </Provider>,
        );

        const activeCheckbox = screen.getByLabelText("Ativo");
        fireEvent.click(activeCheckbox);

        // Add your assertions for the changeActive function here
    });
});
