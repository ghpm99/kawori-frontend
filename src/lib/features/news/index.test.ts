jest.mock("axios", () => {
    const actual = jest.requireActual("axios");
    return {
        ...actual,
        create: jest.fn(() => ({
            get: jest.fn(),
            post: jest.fn(),
            interceptors: {
                request: { use: jest.fn() },
                response: { use: jest.fn() },
            },
        })),
    };
});

import reducer, { newsFeedSlice, fetchNewsFeedThunk } from "./index";

const initialState = newsFeedSlice.getInitialState();

describe("news slice", () => {
    describe("estado inicial", () => {
        it("deve ter data vazio e status 'waiting'", () => {
            expect(initialState.data).toEqual([]);
            expect(initialState.status).toBe("waiting");
        });
    });

    describe("extraReducers", () => {
        it("fetchNewsFeedThunk.pending deve marcar status como 'loading'", () => {
            const result = reducer(initialState, { type: fetchNewsFeedThunk.pending.type });

            expect(result.status).toBe("loading");
        });

        it("fetchNewsFeedThunk.fulfilled deve popular data e marcar status 'success'", () => {
            const newsData = [
                { first_publication_date: "2024-01-01", url: "/news/article-1", title: "Article 1" },
                { first_publication_date: "2024-01-02", url: "/news/article-2", title: "Article 2" },
            ];

            const action = {
                type: fetchNewsFeedThunk.fulfilled.type,
                payload: newsData,
            };

            const result = reducer(initialState, action);

            expect(result.data).toEqual(newsData);
            expect(result.status).toBe("success");
        });

        it("fetchNewsFeedThunk.rejected deve marcar status como 'error'", () => {
            const result = reducer(initialState, { type: fetchNewsFeedThunk.rejected.type });

            expect(result.status).toBe("error");
        });

        it("deve transitar de 'loading' para 'success' ao completar", () => {
            const loadingState = { ...initialState, status: "loading" as const };
            const action = {
                type: fetchNewsFeedThunk.fulfilled.type,
                payload: [{ first_publication_date: "2024-01-01", url: "/", title: "Test" }],
            };

            const result = reducer(loadingState, action);

            expect(result.status).toBe("success");
        });
    });
});
