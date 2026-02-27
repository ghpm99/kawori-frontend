import tagReducer, { changeVisibleModalTag, fetchTags } from "./index";

// Mock the financial service to prevent real network calls
jest.mock("@/services/financial", () => ({
    fetchTagsService: jest.fn(),
    updateAllContractsValue: jest.fn(),
}));

const initialState: ITagStore = {
    data: [],
    loading: true,
    modal: {
        newTag: {
            visible: false,
            error: false,
            errorMsg: "",
        },
    },
};

describe("financialSlice (tag)", () => {
    describe("initial state", () => {
        test("should return the initial state", () => {
            const state = tagReducer(undefined, { type: "@@INIT" });

            expect(state).toEqual(initialState);
        });
    });

    describe("changeVisibleModalTag", () => {
        test("should set modal visible to true", () => {
            const action = changeVisibleModalTag({ modal: "newTag", visible: true });
            const state = tagReducer(initialState, action);

            expect(state.modal.newTag.visible).toBe(true);
        });

        test("should set modal visible to false", () => {
            const openState: ITagStore = {
                ...initialState,
                modal: { newTag: { ...initialState.modal.newTag, visible: true } },
            };
            const action = changeVisibleModalTag({ modal: "newTag", visible: false });
            const state = tagReducer(openState, action);

            expect(state.modal.newTag.visible).toBe(false);
        });
    });

    describe("fetchTags async thunk", () => {
        test("should set loading to true on pending", () => {
            const action = { type: fetchTags.pending.type };
            const startState: ITagStore = { ...initialState, loading: false };
            const state = tagReducer(startState, action);

            expect(state.loading).toBe(true);
        });

        test("should set data and loading to false on fulfilled", () => {
            const mockTags: ITags[] = [
                { id: 1, name: "Tag A", color: "#ff0000" },
                { id: 2, name: "Tag B", color: "#00ff00" },
            ];
            const action = { type: fetchTags.fulfilled.type, payload: { data: mockTags } };
            const state = tagReducer(initialState, action);

            expect(state.data).toEqual(mockTags);
            expect(state.loading).toBe(false);
        });

        test("should preserve modal state across fetches", () => {
            const openState: ITagStore = {
                ...initialState,
                modal: { newTag: { ...initialState.modal.newTag, visible: true } },
            };
            const action = { type: fetchTags.pending.type };
            const state = tagReducer(openState, action);

            expect(state.modal.newTag.visible).toBe(true);
        });
    });
});
