import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import Rank from "./page";
import { setSelectedMenu, getAllAnswers } from "@/lib/features/auth";

jest.mock("@/lib/hooks", () => ({
    useAppDispatch: () => jest.fn(),
    useAppSelector: jest.fn().mockReturnValue({
        classification: {
            answers: [],
        },
    }),
}));

jest.mock("@/lib/features/auth", () => ({
    setSelectedMenu: jest.fn(),
    getAllAnswers: jest.fn(),
}));

jest.mock("@/util", () => ({
    formatterDetailedDate: jest.fn((date) => date),
}));

const mockStore = configureStore([thunk]);

describe("Rank Component", () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            classification: {
                answers: [
                    {
                        question: "Question 1",
                        vote: 4,
                        bdo_class: "Class 1",
                        combat_style: 1,
                        created_at: "2023-10-01",
                    },
                ],
            },
        });
    });

    test("should render the Rank component", () => {
        render(
            <Provider store={store}>
                <Rank />
            </Provider>,
        );

        expect(screen.getByText("Kawori")).toBeInTheDocument();
        expect(screen.getByText("Rank de classes")).toBeInTheDocument();
        expect(screen.getByText("Deseja votar em alguma classe?")).toBeInTheDocument();
        expect(screen.getByText("Clique aqui")).toBeInTheDocument();
        expect(screen.getByText("Rank de Classes")).toBeInTheDocument();
        expect(screen.getByText("Bem-vindo(a) à página de ranking de classes!")).toBeInTheDocument();
        expect(screen.getByText("Meus ultimos votos")).toBeInTheDocument();
    });

    test("should dispatch actions on mount", () => {
        render(
            <Provider store={store}>
                <Rank />
            </Provider>,
        );

        expect(setSelectedMenu).toHaveBeenCalledWith(["rank"]);
        expect(getAllAnswers).toHaveBeenCalled();
    });

    test("should render the table with correct data", () => {
        render(
            <Provider store={store}>
                <Rank />
            </Provider>,
        );

        expect(screen.getByText("Question 1")).toBeInTheDocument();
        expect(screen.getByText("Class 1 - Despertar")).toBeInTheDocument();
        expect(screen.getByText("2023-10-01")).toBeInTheDocument();
    });
});
