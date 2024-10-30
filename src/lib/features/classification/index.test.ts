import { getAllBdoClass, getAllQuestions } from "@/services/classification"
import { configureStore } from "@reduxjs/toolkit"
import axios from "axios"
import classificationReducer, { QuestionData, setQuestionVote, setSelectedBdoClass } from "./index"

jest.mock("axios");

const questionMock: QuestionData[] = [
    { id: 1, question_text: "Question 1", question_details: "Details 1", pub_date: "2023-01-01", vote: undefined },
    { id: 2, question_text: "Question 2", question_details: "Details 2", pub_date: "2023-01-02", vote: undefined },
    { id: 3, question_text: "Question 3", question_details: "Details 3", pub_date: "2023-01-03", vote: 4 },
];

const bdoClassMock: IClass[] = [
    {
        id: 1,
        name: "Warrior",
        abbreviation: "Guerreiro",
        class_image: "",
        color: "",
    },
];

describe("classification slice", () => {
    let store;

    beforeAll(() => {
        store = configureStore({
            reducer: {
                classification: classificationReducer,
            },
        });
        (axios.get as jest.Mock).mockResolvedValue({ data: { data: questionMock } });
        store.dispatch(getAllQuestions());
        (axios.get as jest.Mock).mockResolvedValue({ data: { class: bdoClassMock } });
        store.dispatch(getAllBdoClass());
    });

    test("should update the vote for a specific question", () => {
        store.dispatch(setQuestionVote({ id: 1, vote: 5 }));
        const state = store.getState().classification;
        expect(state.questions[0].vote).toBe(5);
    });

    test("should set the selected BDO class and reset votes", () => {
        store.dispatch(setSelectedBdoClass({ class: 1, profile: 1 }));
        const state = store.getState().classification;
        expect(state.selectedBdoClass).toStrictEqual({
            class: { abbreviation: "Guerreiro", class_image: "", color: "", id: 1, name: "Warrior" },
            profile: 1,
        });
        expect(state.questions[2].vote).toBeUndefined();
    });
});
