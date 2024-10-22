import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import Vote from "./page";
import { setSelectedMenu, getAllQuestions, getAllBdoClass } from "@/lib/features/auth";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock("@/lib/hooks", () => ({
    useAppDispatch: () => jest.fn(),
    useAppSelector: jest.fn((fn) => fn(mockStore.getState())),
}));

jest.mock("@/lib/features/auth", () => ({
    setSelectedMenu: jest.fn(),
    getAllQuestions: jest.fn(),
    getAllBdoClass: jest.fn(),
}));

jest.mock("@/components/rank/intro", () => {
    const Intro = () => <div>Intro Component</div>;
    Intro.displayName = "Intro";
    return Intro;
});
jest.mock("@/components/rank/question", () => {
    const Question = () => <div>Question Component</div>;
    Question.displayName = "Question";
    return Question;
});
jest.mock("@/components/rank/finished", () => {
    const Finished = () => <div>Finished Component</div>;
    Finished.displayName = "Finished";
    return Finished;
});

describe("Vote Component", () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            classification: {
                questions: [
                    { id: 1, text: "Question 1" },
                    { id: 2, text: "Question 2" },
                ],
                selectedBdoClass: { class: { abbreviation: "ABC" } },
                class: "Class 1",
            },
        });

        render(
            <Provider store={store}>
                <Vote />
            </Provider>,
        );
    });

    test("should render breadcrumb correctly", () => {
        expect(screen.getByText("Kawori")).toBeInTheDocument();
        expect(screen.getByText("Rank de classes")).toBeInTheDocument();
        expect(screen.getByText("Votar")).toBeInTheDocument();
        expect(screen.getByText("ABC")).toBeInTheDocument();
    });

    test("should render Intro component initially", () => {
        expect(screen.getByText("Intro Component")).toBeInTheDocument();
    });

    test("should dispatch actions on mount", () => {
        expect(setSelectedMenu).toHaveBeenCalledWith(["rank"]);
        expect(getAllQuestions).toHaveBeenCalled();
        expect(getAllBdoClass).toHaveBeenCalled();
    });

    test("should navigate to next question", () => {
        fireEvent.click(screen.getByText("Intro Component"));
        expect(screen.getByText("Question Component")).toBeInTheDocument();
    });

    test("should navigate to previous question", () => {
        fireEvent.click(screen.getByText("Intro Component"));
        fireEvent.click(screen.getByText("Question Component"));
        fireEvent.click(screen.getByText("Question Component"));
        expect(screen.getByText("Intro Component")).toBeInTheDocument();
    });

    test("should render Finished component after last question", () => {
        fireEvent.click(screen.getByText("Intro Component"));
        fireEvent.click(screen.getByText("Question Component"));
        fireEvent.click(screen.getByText("Question Component"));
        expect(screen.getByText("Finished Component")).toBeInTheDocument();
    });
});
