import { getAllAnswers, getAllBdoClass, getAllQuestions } from "@/services/classification";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface QuestionData {
    id: number;
    question_text: string;
    question_details: string;
    pub_date: string;
    vote: number | undefined;
}

interface AnswerData {
    questionId: number;
    bdoClassId: number;
    vote: number;
}

interface ClassificationState {
    questions: QuestionData[];
    answers: AnswerData[];
    class: IClass[];
    selectedBdoClass: IClass | undefined;
}

const initialState: ClassificationState = {
    questions: [],
    answers: [],
    class: [],
    selectedBdoClass: undefined,
};

export const classificationSlice = createSlice({
    name: "classification",
    initialState,
    reducers: {
        setQuestionVote: (state: ClassificationState, action: PayloadAction<{ id: number; vote: number }>) => {
            const questionSource = state.questions.findIndex((question) => question.id === action.payload.id);
            state.questions[questionSource].vote = action.payload.vote;
        },
        setSelectedBdoClass: (state: ClassificationState, action: PayloadAction<number>) => {
            const targetBdoClass = state.class.find((bdoClass) => bdoClass.id === action.payload);
            state.selectedBdoClass = targetBdoClass;
            state.questions = state.questions.map((question) => ({
                ...question,
                vote: undefined,
            }));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllQuestions.fulfilled, (state, action) => {
                state.questions = action.payload.data;
            })
            .addCase(getAllAnswers.fulfilled, (state, action) => {
                state.answers = action.payload;
            })
            .addCase(getAllBdoClass.fulfilled, (state, action) => {
                state.class = action.payload.class;
            });
    },
});

export const { setQuestionVote, setSelectedBdoClass } = classificationSlice.actions;

export default classificationSlice.reducer;
