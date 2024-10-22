import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Intro from "./index";
import { setSelectedBdoClass } from "@/lib/features/classification";

const mockStore = configureStore([]);
const nextQuestion = jest.fn();

const bdoClass = [
    { id: 1, abbreviation: "Class1" },
    { id: 17, abbreviation: "Class17" },
    { id: 27, abbreviation: "Class27" },
    { id: 28, abbreviation: "Class28" },
];

describe("Intro Component", () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            // Add initial state if needed
        });

        store.dispatch = jest.fn();
    });

    test("renders Intro component", () => {
        render(
            <Provider store={store}>
                <Intro nextQuestion={nextQuestion} bdoClass={bdoClass} />
            </Provider>,
        );

        expect(screen.getByText("Votação de classe")).toBeInTheDocument();
        expect(screen.getByText("Selecione a classe:")).toBeInTheDocument();
        expect(screen.getByText("Selecione o estilo de combate:")).toBeInTheDocument();
    });

    test("handles class selection and updates profile selection", () => {
        render(
            <Provider store={store}>
                <Intro nextQuestion={nextQuestion} bdoClass={bdoClass} />
            </Provider>,
        );

        fireEvent.change(screen.getByPlaceholderText("Selecione a classe"), { target: { value: 1 } });
        expect(screen.getByPlaceholderText("Selecione o estilo de combate")).toBeDisabled();

        fireEvent.change(screen.getByPlaceholderText("Selecione a classe"), { target: { value: 28 } });
        expect(screen.getByPlaceholderText("Selecione o estilo de combate")).not.toBeDisabled();
    });

    test("dispatches setSelectedBdoClass and calls nextQuestion on startQuestion", () => {
        render(
            <Provider store={store}>
                <Intro nextQuestion={nextQuestion} bdoClass={bdoClass} />
            </Provider>,
        );

        fireEvent.change(screen.getByPlaceholderText("Selecione a classe"), { target: { value: 1 } });
        fireEvent.change(screen.getByPlaceholderText("Selecione o estilo de combate"), { target: { value: 1 } });

        fireEvent.click(screen.getByText("Começar"));

        expect(store.dispatch).toHaveBeenCalledWith(setSelectedBdoClass({ class: 1, profile: 1 }));
        expect(nextQuestion).toHaveBeenCalled();
    });

    test("start button is disabled when class or profile is not selected", () => {
        render(
            <Provider store={store}>
                <Intro nextQuestion={nextQuestion} bdoClass={bdoClass} />
            </Provider>,
        );

        expect(screen.getByText("Começar")).toBeDisabled();

        fireEvent.change(screen.getByPlaceholderText("Selecione a classe"), { target: { value: 1 } });
        expect(screen.getByText("Começar")).toBeDisabled();

        fireEvent.change(screen.getByPlaceholderText("Selecione o estilo de combate"), { target: { value: 1 } });
        expect(screen.getByText("Começar")).not.toBeDisabled();
    });
});
