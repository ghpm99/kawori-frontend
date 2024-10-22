import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Question from "./index";
import { QuestionData, SelectedClass } from "@/lib/features/classification";
import { setQuestionVote, registerAnswer } from "@/services/classification";
import { message } from "antd";

jest.mock("@/services/classification");
jest.mock("antd", () => ({
    ...jest.requireActual("antd"),
    message: {
        info: jest.fn(),
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const mockStore = configureStore([]);
const store = mockStore({});

const question: QuestionData = {
    id: 1,
    question_text: "Sample Question?",
    question_details: "<p>Details of the question</p>",
    vote: 0,
};

const selectedBdoClass: SelectedClass = {
    class: { id: 1, name: "Warrior" },
    profile: "Aggressive",
};

const text = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

describe("Question Component", () => {
    beforeEach(() => {
        store.clearActions();
    });

    test("renders the question text", () => {
        render(
            <Provider store={store}>
                <Question
                    question={question}
                    text={text}
                    hasPrevious={false}
                    extra="Extra Info"
                    selectedBdoClass={selectedBdoClass}
                    nextQuestion={jest.fn()}
                    previousQuestion={jest.fn()}
                />
            </Provider>,
        );

        expect(screen.getByText("Sample Question?")).toBeInTheDocument();
    });

    test("calls setVote when a rating is selected", () => {
        render(
            <Provider store={store}>
                <Question
                    question={question}
                    text={text}
                    hasPrevious={false}
                    extra="Extra Info"
                    selectedBdoClass={selectedBdoClass}
                    nextQuestion={jest.fn()}
                    previousQuestion={jest.fn()}
                />
            </Provider>,
        );

        fireEvent.click(screen.getByLabelText("Good"));

        const actions = store.getActions();
        expect(actions).toContainEqual(setQuestionVote({ id: 1, vote: 3 }));
    });

    test("displays a message and calls nextQuestion when skip button is clicked", () => {
        const nextQuestionMock = jest.fn();

        render(
            <Provider store={store}>
                <Question
                    question={question}
                    text={text}
                    hasPrevious={false}
                    extra="Extra Info"
                    selectedBdoClass={selectedBdoClass}
                    nextQuestion={nextQuestionMock}
                    previousQuestion={jest.fn()}
                />
            </Provider>,
        );

        fireEvent.click(screen.getByText("Pular"));

        expect(message.info).toHaveBeenCalledWith({
            content: "Questão pulada",
            key: "rank-message-ref",
        });
        expect(nextQuestionMock).toHaveBeenCalled();
    });

    test("dispatches registerAnswer and handles success message", async () => {
        const nextQuestionMock = jest.fn();
        (registerAnswer as jest.Mock).mockResolvedValue({
            type: "registerAnswer/fulfilled",
            payload: { msg: "Success message" },
        });

        render(
            <Provider store={store}>
                <Question
                    question={{ ...question, vote: 3 }}
                    text={text}
                    hasPrevious={false}
                    extra="Extra Info"
                    selectedBdoClass={selectedBdoClass}
                    nextQuestion={nextQuestionMock}
                    previousQuestion={jest.fn()}
                />
            </Provider>,
        );

        fireEvent.click(screen.getByText("Proximo"));

        expect(registerAnswer).toHaveBeenCalledWith({
            answerData: {
                bdo_class_id: 1,
                combat_style: "Aggressive",
                question_id: 1,
                vote: 3,
            },
        });

        await screen.findByText("Success message");
        expect(message.success).toHaveBeenCalledWith({
            content: "Success message",
            key: "rank-message-ref",
        });
        expect(nextQuestionMock).toHaveBeenCalled();
    });

    test("dispatches registerAnswer and handles error message", async () => {
        const nextQuestionMock = jest.fn();
        (registerAnswer as jest.Mock).mockResolvedValue({
            type: "registerAnswer/rejected",
            payload: "Error message",
        });

        render(
            <Provider store={store}>
                <Question
                    question={{ ...question, vote: 3 }}
                    text={text}
                    hasPrevious={false}
                    extra="Extra Info"
                    selectedBdoClass={selectedBdoClass}
                    nextQuestion={nextQuestionMock}
                    previousQuestion={jest.fn()}
                />
            </Provider>,
        );

        fireEvent.click(screen.getByText("Proximo"));

        await screen.findByText("Error message");
        expect(message.error).toHaveBeenCalledWith({
            content: "Error message",
            key: "rank-message-ref",
        });
    });
});
