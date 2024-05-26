import { getAllAnswers, getAllQuestions } from "@/services/classification";
import { createSlice } from "@reduxjs/toolkit";

export interface QuestionData {
    id: number;
    question_text: string;
    pub_date: string;
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
                state.questions = action.payload.data;
            })
            .addCase(getAllAnswers.fulfilled, (state, action) => {
                state.answers = action.payload;
            });
    },
});

export default classificationSlice.reducer;
