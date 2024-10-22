import { configureStore } from "@reduxjs/toolkit";
import financialReducer, { fetchTags, changeVisibleModalTag } from "./index";
import { fetchTagsService } from "@/services/financial";

// Mock the fetchTagsService
jest.mock("@/services/financial");

describe("financialSlice", () => {
    let store: ReturnType<typeof configureStore>;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                financial: financialReducer,
            },
        });
    });

    it("should handle initial state", () => {
        const state = store.getState().financial;
        expect(state).toEqual({
            data: [],
            loading: true,
            modal: {
                newTag: {
                    visible: false,
                    error: false,
                    errorMsg: "",
                },
            },
        });
    });

    it("should handle changeVisibleModalTag", () => {
        store.dispatch(changeVisibleModalTag({ modal: "newTag", visible: true }));
        const state = store.getState().financial;
        expect(state.modal.newTag.visible).toBe(true);
    });

    it("should handle fetchTags pending", () => {
        store.dispatch(fetchTags.pending("", undefined));
        const state = store.getState().financial;
        expect(state.loading).toBe(true);
    });

    it("should handle fetchTags fulfilled", async () => {
        const mockTags = { data: [{ id: 1, name: "Tag1" }] };
        (fetchTagsService as jest.Mock).mockResolvedValueOnce(mockTags);

        await store.dispatch(fetchTags() as any);
        const state = store.getState().financial;
        expect(state.data).toEqual(mockTags.data);
        expect(state.loading).toBe(false);
    });
});
