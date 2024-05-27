import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiDjango } from "..";

interface AnswerData {
    question_id: number;
    bdo_class_id: number;
    vote: number;
}

export const getAllQuestions = createAsyncThunk("classification/getAllQuestions", async () => {
    const response = await apiDjango.get("/classification/get-question/");
    return response.data;
});

export const getAllAnswers = createAsyncThunk("classification/getAllAnswers", async () => {
    const response = await apiDjango.get("/classification/get-answer/");
    return response.data;
});

export const registerAnswer = createAsyncThunk(
    "classification/registerAnswer",
    async ({ answerData }: { answerData: AnswerData }) => {
        const response = await apiDjango.post("/classification/register-answer/", answerData);
        return response.data;
    },
);

export const getAllBdoClass = createAsyncThunk("classification/getAllBdoClass", async () => {
    const response = await apiDjango.get("/classification/get-class/");
    return response.data;
});
