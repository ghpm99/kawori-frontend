import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiDjango } from "..";

interface AnswerData {
    question_id: number;
    bdo_class_id: number;
    vote: number;
}

export const getAllQuestions = createAsyncThunk("questions/getAll", async () => {
    const response = await apiDjango.get("/classification/get-question/");
    return response.data;
});

export const getAllAnswers = createAsyncThunk("answers/getAll", async () => {
    const response = await apiDjango.get("/classification/get-answer/");
    return response.data;
});

export const registerAnswer = createAsyncThunk(
    "answers/register",
    async ({ answerData }: { answerData: AnswerData }) => {
        const response = await apiDjango.post("/classification/register-answer/", answerData);
        return response.data;
    },
);
