import { configureStore } from "@reduxjs/toolkit";
import { fetchFaceTextureClassService, fetchFacetextureService } from "@/services/facetexture";
import facetextureReducer, {
    fetchFacetexture,
    updateFacetextureUrlReducer,
    updateBackgroundReducer,
    setSelectedFacetextureReducer,
    reorderCharacterReducer,
    updateFacetextureClassModalReducer,
    deleteCharacterReducer,
    updateFacetextureVisibleClassModalReducer,
    setFacetextureIsEdited,
    updateFacetextureImageNameModalReducer,
    changeModalVisible,
    changeFacetextureSavingModalReducer,
} from "./index";

jest.mock("@/services/facetexture");

const initialState = {
    loading: true,
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
            data: {
                name: "",
                visible: true,
                classId: 0,
            },
        },
    },
};

const store = configureStore({
    reducer: {
        facetexture: facetextureReducer,
    },
});

describe("facetextureSlice", () => {
    beforeEach(() => {
        store.dispatch({ type: "facetexture/reset" });
    });

    test("should handle initial state", () => {
        expect(store.getState().facetexture).toEqual(initialState);
    });

    test("should handle updateFacetextureUrlReducer", () => {
        store.dispatch(updateFacetextureUrlReducer({ id: 1, image: "new_image_url" }));
        const state = store.getState().facetexture;
        expect(state.facetexture.find((face) => face.id === 1).image).toEqual("new_image_url");
    });

    test("should handle updateBackgroundReducer", () => {
        store.dispatch(updateBackgroundReducer("new_background_url"));
        const state = store.getState().facetexture;
        expect(state.backgroundUrl).toEqual("new_background_url");
    });

    test("should handle setSelectedFacetextureReducer", () => {
        store.dispatch(setSelectedFacetextureReducer(1));
        const state = store.getState().facetexture;
        expect(state.selected).toEqual(1);
    });

    test("should handle reorderCharacterReducer", () => {
        store.dispatch(reorderCharacterReducer({ indexSource: 0, indexDestination: 1 }));
        const state = store.getState().facetexture;
        expect(state.facetexture[1]).toEqual(initialState.facetexture[0]);
    });

    test("should handle updateFacetextureClassModalReducer", () => {
        store.dispatch(updateFacetextureClassModalReducer({ classId: 1 }));
        const state = store.getState().facetexture;
        expect(state.modal.newFacetexture.data.classId).toEqual(1);
    });

    test("should handle deleteCharacterReducer", () => {
        store.dispatch(deleteCharacterReducer(1));
        const state = store.getState().facetexture;
        expect(state.facetexture.find((face) => face.id === 1)).toBeUndefined();
    });

    test("should handle updateFacetextureVisibleClassModalReducer", () => {
        store.dispatch(updateFacetextureVisibleClassModalReducer({ visible: false }));
        const state = store.getState().facetexture;
        expect(state.modal.newFacetexture.data.visible).toEqual(false);
    });

    test("should handle setFacetextureIsEdited", () => {
        store.dispatch(setFacetextureIsEdited(true));
        const state = store.getState().facetexture;
        expect(state.edited).toEqual(true);
    });

    test("should handle updateFacetextureImageNameModalReducer", () => {
        store.dispatch(updateFacetextureImageNameModalReducer({ name: "new_name" }));
        const state = store.getState().facetexture;
        expect(state.modal.newFacetexture.data.name).toEqual("new_name");
    });

    test("should handle changeModalVisible", () => {
        store.dispatch(changeModalVisible({ modal: "newFacetexture", visible: true }));
        const state = store.getState().facetexture;
        expect(state.modal.newFacetexture.visible).toEqual(true);
    });

    test("should handle changeFacetextureSavingModalReducer", () => {
        store.dispatch(changeFacetextureSavingModalReducer(true));
        const state = store.getState().facetexture;
        expect(state.modal.newFacetexture.saving).toEqual(true);
    });

    test("should handle fetchFacetexture", async () => {
        fetchFaceTextureClassService.mockResolvedValue({ class: [] });
        fetchFacetextureService.mockResolvedValue({ characters: [] });

        await store.dispatch(fetchFacetexture());

        const state = store.getState().facetexture;
        expect(state.loading).toEqual(false);
        expect(state.class).toEqual([]);
        expect(state.facetexture).toEqual([]);
    });
});
