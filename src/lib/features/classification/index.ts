import { getAllAnswers, getAllQuestions } from "@/services/classification";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface QuestionData {
    id: number;
    question_text: string;
    question_details: string;
    pub_date: string;
    vote: number;
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
    reducers: {
        setQuestionVote: (state: ClassificationState, action: PayloadAction<{ id: number; vote: number }>) => {
            const questionSource = state.questions.findIndex((question) => question.id === action.payload.id);
            state.questions[questionSource].vote = action.payload.vote;
        },
    },
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

export const { setQuestionVote } = classificationSlice.actions;

export default classificationSlice.reducer;
