import { getAllAnswers, getAllQuestions } from "@/services/classification";
import { createSlice } from "@reduxjs/toolkit";

interface QuestionData {
    questionText: string;
    pubDate: string;
}

interface AnswerData {
    questionId: number;
    bdoClassId: number;
    vote: number;
}

interface ClassificationState {
    questions: QuestionData[];
    answers: AnswerData[];
}

const initialState: ClassificationState = {
    questions: [],
    answers: [],
};

export const classificationSlice = createSlice({
    name: "classification",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllQuestions.fulfilled, (state, action) => {
                state.questions = action.payload;
            })
            .addCase(getAllAnswers.fulfilled, (state, action) => {
                state.answers = action.payload;
            });
    },
});

export default classificationSlice.reducer;
