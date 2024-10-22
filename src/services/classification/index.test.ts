import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiDjango } from "..";
import { AxiosError } from "axios";
import {
    getAllQuestions,
    getAllAnswers,
    registerAnswer,
    getAllBdoClass,
    getTotalVotes,
    getAnswerByClass,
    getAnswerSummary,
} from "./index";

jest.mock("..", () => ({
    apiDjango: {
        get: jest.fn(),
        post: jest.fn(),
    },
}));

describe("classification service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should fetch all questions", async () => {
        const mockData = [{ id: 1, question: "Sample question?" }];
        (apiDjango.get as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await getAllQuestions(null, {
            dispatch: jest.fn(),
            getState: jest.fn(),
            rejectWithValue: jest.fn(),
        });

        expect(apiDjango.get).toHaveBeenCalledWith("/classification/get-question/");
        expect(result.payload).toEqual(mockData);
    });

    test("should fetch all answers", async () => {
        const mockData = [{ id: 1, answer: "Sample answer" }];
        (apiDjango.get as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await getAllAnswers(null, {
            dispatch: jest.fn(),
            getState: jest.fn(),
            rejectWithValue: jest.fn(),
        });

        expect(apiDjango.get).toHaveBeenCalledWith("/classification/get-answer/");
        expect(result.payload).toEqual(mockData);
    });

    test("should register an answer", async () => {
        const answerData = { question_id: 1, bdo_class_id: 1, combat_style: 1, vote: 1 };
        const mockData = { success: true };
        (apiDjango.post as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await registerAnswer(
            { answerData },
            { dispatch: jest.fn(), getState: jest.fn(), rejectWithValue: jest.fn() },
        );

        expect(apiDjango.post).toHaveBeenCalledWith("/classification/register-answer/", answerData);
        expect(result.payload).toEqual(mockData);
    });

    test("should handle error when registering an answer", async () => {
        const answerData = { question_id: 1, bdo_class_id: 1, combat_style: 1, vote: 1 };
        const mockError = { response: { data: { msg: "Error message" } } };
        (apiDjango.post as jest.Mock).mockRejectedValue(mockError);

        const rejectWithValue = jest.fn();
        await registerAnswer({ answerData }, { dispatch: jest.fn(), getState: jest.fn(), rejectWithValue });

        expect(apiDjango.post).toHaveBeenCalledWith("/classification/register-answer/", answerData);
        expect(rejectWithValue).toHaveBeenCalledWith("Error message");
    });

    test("should fetch all BDO classes", async () => {
        const mockData = [{ id: 1, class: "Warrior" }];
        (apiDjango.get as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await getAllBdoClass(null, {
            dispatch: jest.fn(),
            getState: jest.fn(),
            rejectWithValue: jest.fn(),
        });

        expect(apiDjango.get).toHaveBeenCalledWith("/classification/get-class/");
        expect(result.payload).toEqual(mockData);
    });

    test("should fetch total votes", async () => {
        const mockData = { total: 100 };
        (apiDjango.get as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await getTotalVotes(null, {
            dispatch: jest.fn(),
            getState: jest.fn(),
            rejectWithValue: jest.fn(),
        });

        expect(apiDjango.get).toHaveBeenCalledWith("/classification/total-votes/");
        expect(result.payload).toEqual(mockData);
    });

    test("should fetch answers by class", async () => {
        const mockData = [{ class_id: 1, answers: [] }];
        (apiDjango.get as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await getAnswerByClass(null, {
            dispatch: jest.fn(),
            getState: jest.fn(),
            rejectWithValue: jest.fn(),
        });

        expect(apiDjango.get).toHaveBeenCalledWith("/classification/answer-by-class/");
        expect(result.payload).toEqual(mockData);
    });

    test("should fetch answer summary", async () => {
        const mockData = { summary: "Sample summary" };
        (apiDjango.get as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await getAnswerSummary(null, {
            dispatch: jest.fn(),
            getState: jest.fn(),
            rejectWithValue: jest.fn(),
        });

        expect(apiDjango.get).toHaveBeenCalledWith("/classification/get-answer-summary/");
        expect(result.payload).toEqual(mockData);
    });
});
