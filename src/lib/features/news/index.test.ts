import newsFeedReducer, { fetchNewsFeedThunk, INewsData } from "./index";

describe("newsFeedSlice", () => {
    const initialState = {
        data: [] as INewsData[],
        status: "waiting" as const,
    };

    describe("initial state", () => {
        test("should return the initial state", () => {
            const state = newsFeedReducer(undefined, { type: "@@INIT" });

            expect(state).toEqual({ data: [], status: "waiting" });
        });
    });

    describe("fetchNewsFeedThunk", () => {
        test("should set status to loading on pending", () => {
            const action = { type: fetchNewsFeedThunk.pending.type };
            const state = newsFeedReducer(initialState, action);

            expect(state.status).toBe("loading");
        });

        test("should set data and status to success on fulfilled", () => {
            const mockData: INewsData[] = [
                { title: "News 1", url: "/news/1", first_publication_date: "2024-01-01" },
                { title: "News 2", url: "/news/2", first_publication_date: "2024-02-01" },
            ];
            const action = { type: fetchNewsFeedThunk.fulfilled.type, payload: mockData };
            const state = newsFeedReducer(initialState, action);

            expect(state.data).toEqual(mockData);
            expect(state.status).toBe("success");
        });

        test("should set status to error on rejected", () => {
            const action = { type: fetchNewsFeedThunk.rejected.type };
            const state = newsFeedReducer(initialState, action);

            expect(state.status).toBe("error");
        });

        test("should preserve existing data when transitioning to loading", () => {
            const existingState = {
                data: [{ title: "Old", url: "/old", first_publication_date: "2023-01-01" }],
                status: "success" as const,
            };
            const action = { type: fetchNewsFeedThunk.pending.type };
            const state = newsFeedReducer(existingState, action);

            expect(state.status).toBe("loading");
            expect(state.data).toEqual(existingState.data);
        });
    });
});
