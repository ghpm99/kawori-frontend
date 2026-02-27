import facetextureReducer, {
    changeModalVisible,
    changeFacetextureSavingModalReducer,
    deleteCharacterReducer,
    fetchFacetexture,
    reorderCharacterReducer,
    setFacetextureIsEdited,
    setSelectedFacetextureReducer,
    updateBackgroundReducer,
} from "./index";

// Mock services to prevent real network calls when the module is loaded
jest.mock("@/services/facetexture", () => ({
    fetchFaceTextureClassService: jest.fn(),
    fetchFacetextureService: jest.fn(),
    newCharacterThunk: {
        pending: { type: "facetexture/NewCharacter/pending" },
        fulfilled: { type: "facetexture/NewCharacter/fulfilled" },
        rejected: { type: "facetexture/NewCharacter/rejected" },
    },
    reorderCharacterThunk: {
        pending: { type: "facetexture/reorderCharacter/pending" },
        fulfilled: { type: "facetexture/reorderCharacter/fulfilled" },
    },
    changeClassCharacterThunk: {
        fulfilled: { type: "facetexture/changeClassCharacter/fulfilled" },
    },
    deleteCharacterThunk: {
        fulfilled: { type: "facetexture/deleteCharacter/fulfilled" },
    },
    changeShowClassThunk: {
        fulfilled: { type: "facetexture/changeShowClass/fulfilled" },
    },
}));

const baseState: IFacetextureState = {
    loading: false,
    backgroundUrl: "",
    class: [],
    facetexture: [],
    selected: undefined,
    edited: false,
    error: false,
    modal: {
        newFacetexture: {
            visible: false,
            saving: false,
            data: { name: "", visible: true, classId: 0 },
        },
    },
};

describe("facetextureSlice", () => {
    describe("updateBackgroundReducer", () => {
        test("should update backgroundUrl", () => {
            const state = facetextureReducer(baseState, updateBackgroundReducer("blob:new-bg"));
            expect(state.backgroundUrl).toBe("blob:new-bg");
        });
    });

    describe("setSelectedFacetextureReducer", () => {
        test("should set the selected facetexture index", () => {
            const state = facetextureReducer(baseState, setSelectedFacetextureReducer(3));
            expect(state.selected).toBe(3);
        });
    });

    describe("reorderCharacterReducer", () => {
        test("should reorder facetexture list", () => {
            const stateWithItems: IFacetextureState = {
                ...baseState,
                facetexture: [
                    { id: 1, name: "A", class: { id: 1, name: "W", abbreviation: "W", class_image: "" }, show: true, image: "", order: 0 },
                    { id: 2, name: "B", class: { id: 1, name: "W", abbreviation: "W", class_image: "" }, show: true, image: "", order: 1 },
                    { id: 3, name: "C", class: { id: 1, name: "W", abbreviation: "W", class_image: "" }, show: true, image: "", order: 2 },
                ],
            };
            // Move item at index 0 to index 2
            const state = facetextureReducer(stateWithItems, reorderCharacterReducer({ indexSource: 0, indexDestination: 2 }));
            expect(state.facetexture[0].name).toBe("B");
            expect(state.facetexture[1].name).toBe("C");
            expect(state.facetexture[2].name).toBe("A");
        });
    });

    describe("deleteCharacterReducer", () => {
        test("should remove character at given index and set edited to true", () => {
            const stateWithItems: IFacetextureState = {
                ...baseState,
                facetexture: [
                    { id: 1, name: "A", class: { id: 1, name: "W", abbreviation: "W", class_image: "" }, show: true, image: "", order: 0 },
                    { id: 2, name: "B", class: { id: 1, name: "W", abbreviation: "W", class_image: "" }, show: true, image: "", order: 1 },
                ],
            };
            const state = facetextureReducer(stateWithItems, deleteCharacterReducer(0));
            expect(state.facetexture).toHaveLength(1);
            expect(state.facetexture[0].name).toBe("B");
            expect(state.edited).toBe(true);
        });
    });

    describe("changeModalVisible", () => {
        test("should toggle modal visibility", () => {
            const state = facetextureReducer(baseState, changeModalVisible({ modal: "newFacetexture", visible: true }));
            expect(state.modal.newFacetexture.visible).toBe(true);
        });

        test("should hide modal when visible is false", () => {
            const openState = { ...baseState, modal: { newFacetexture: { ...baseState.modal.newFacetexture, visible: true } } };
            const state = facetextureReducer(openState, changeModalVisible({ modal: "newFacetexture", visible: false }));
            expect(state.modal.newFacetexture.visible).toBe(false);
        });
    });

    describe("changeFacetextureSavingModalReducer", () => {
        test("should set saving to true", () => {
            const state = facetextureReducer(baseState, changeFacetextureSavingModalReducer(true));
            expect(state.modal.newFacetexture.saving).toBe(true);
        });

        test("should set saving to false", () => {
            const savingState = { ...baseState, modal: { newFacetexture: { ...baseState.modal.newFacetexture, saving: true } } };
            const state = facetextureReducer(savingState, changeFacetextureSavingModalReducer(false));
            expect(state.modal.newFacetexture.saving).toBe(false);
        });
    });

    describe("setFacetextureIsEdited", () => {
        test("should set edited to true", () => {
            const state = facetextureReducer(baseState, setFacetextureIsEdited(true));
            expect(state.edited).toBe(true);
        });

        test("should set edited to false", () => {
            const editedState = { ...baseState, edited: true };
            const state = facetextureReducer(editedState, setFacetextureIsEdited(false));
            expect(state.edited).toBe(false);
        });
    });

    describe("fetchFacetexture async thunk", () => {
        test("should set loading to true and error to false on pending", () => {
            const state = facetextureReducer(baseState, { type: fetchFacetexture.pending.type });
            expect(state.loading).toBe(true);
            expect(state.error).toBe(false);
        });

        test("should set class, facetexture list, and loading to false on fulfilled", () => {
            const payload = {
                characters: [
                    { id: 1, name: "TestChar", class: { id: 1, name: "W", abbreviation: "W", class_image: "" }, show: true, image: "", order: 0 },
                ],
                classes: { class: [{ id: 1, name: "Warrior", abbreviation: "W", class_image: "", class_symbol: "" }] },
            };
            const state = facetextureReducer({ ...baseState, loading: true }, { type: fetchFacetexture.fulfilled.type, payload });
            expect(state.loading).toBe(false);
            expect(state.facetexture).toHaveLength(1);
            expect(state.class).toHaveLength(1);
        });

        test("should set loading to false and error to true on rejected", () => {
            const state = facetextureReducer({ ...baseState, loading: true }, { type: fetchFacetexture.rejected.type });
            expect(state.loading).toBe(false);
            expect(state.error).toBe(true);
        });
    });
});
