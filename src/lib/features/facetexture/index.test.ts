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

import reducer, {
    facetextureSlice,
    updateFacetextureUrlReducer,
    updateBackgroundReducer,
    setSelectedFacetextureReducer,
    deleteCharacterReducer,
    setFacetextureIsEdited,
    updateFacetextureClassModalReducer,
    updateFacetextureVisibleClassModalReducer,
    updateFacetextureImageNameModalReducer,
    changeModalVisible,
    changeFacetextureSavingModalReducer,
    fetchFacetexture,
} from "./index";

const initialState = facetextureSlice.getInitialState();

const createFacetextureState = (): typeof initialState => ({
    ...initialState,
    facetexture: [
        { id: 1, name: "Char1", image: "img1.png", class: { id: 1, class_image: "class1.png" }, order: 0, show: true } as any,
        { id: 2, name: "Char2", image: "img2.png", class: { id: 2, class_image: "class2.png" }, order: 1, show: true } as any,
        { id: 3, name: "Char3", image: "img3.png", class: { id: 1, class_image: "class1.png" }, order: 2, show: false } as any,
    ],
});

describe("facetexture slice", () => {
    describe("estado inicial", () => {
        it("deve ter loading true e listas vazias", () => {
            expect(initialState.loading).toBe(true);
            expect(initialState.facetexture).toEqual([]);
            expect(initialState.class).toEqual([]);
        });

        it("deve ter selected undefined e edited false", () => {
            expect(initialState.selected).toBeUndefined();
            expect(initialState.edited).toBe(false);
        });

        it("deve ter modal newFacetexture com visible false", () => {
            expect(initialState.modal.newFacetexture.visible).toBe(false);
            expect(initialState.modal.newFacetexture.saving).toBe(false);
        });
    });

    describe("reducers síncronos", () => {
        it("updateFacetextureUrlReducer deve atualizar image do personagem pelo id", () => {
            const state = createFacetextureState();
            const result = reducer(state, updateFacetextureUrlReducer({ id: 1, image: "new-img.png" }));

            expect(result.facetexture[0].image).toBe("new-img.png");
        });

        it("updateBackgroundReducer deve atualizar backgroundUrl", () => {
            const result = reducer(initialState, updateBackgroundReducer("background.png"));
            expect(result.backgroundUrl).toBe("background.png");
        });

        it("setSelectedFacetextureReducer deve definir o selecionado", () => {
            const result = reducer(initialState, setSelectedFacetextureReducer(2));
            expect(result.selected).toBe(2);
        });

        it("deleteCharacterReducer deve remover personagem pelo index e marcar como editado", () => {
            const state = createFacetextureState();
            const result = reducer(state, deleteCharacterReducer(1));

            expect(result.facetexture).toHaveLength(2);
            expect(result.facetexture[0].id).toBe(1);
            expect(result.facetexture[1].id).toBe(3);
            expect(result.edited).toBe(true);
        });

        it("setFacetextureIsEdited deve atualizar flag edited", () => {
            const result = reducer(initialState, setFacetextureIsEdited(true));
            expect(result.edited).toBe(true);
        });

        it("updateFacetextureClassModalReducer deve atualizar classId no modal", () => {
            const result = reducer(initialState, updateFacetextureClassModalReducer({ classId: 5 }));
            expect(result.modal.newFacetexture.data.classId).toBe(5);
        });

        it("updateFacetextureVisibleClassModalReducer deve atualizar visible no modal", () => {
            const result = reducer(initialState, updateFacetextureVisibleClassModalReducer({ visible: false }));
            expect(result.modal.newFacetexture.data.visible).toBe(false);
        });

        it("updateFacetextureImageNameModalReducer deve atualizar name no modal", () => {
            const result = reducer(initialState, updateFacetextureImageNameModalReducer({ name: "New Name" }));
            expect(result.modal.newFacetexture.data.name).toBe("New Name");
        });

        it("changeModalVisible deve alternar visibilidade do modal", () => {
            const result = reducer(initialState, changeModalVisible({ modal: "newFacetexture", visible: true }));
            expect(result.modal.newFacetexture.visible).toBe(true);
        });

        it("changeFacetextureSavingModalReducer deve atualizar saving no modal", () => {
            const result = reducer(initialState, changeFacetextureSavingModalReducer(true));
            expect(result.modal.newFacetexture.saving).toBe(true);
        });
    });

    describe("extraReducers", () => {
        it("fetchFacetexture.pending deve marcar loading true e error false", () => {
            const state = { ...initialState, loading: false, error: true };
            const result = reducer(state, { type: fetchFacetexture.pending.type });

            expect(result.loading).toBe(true);
            expect(result.error).toBe(false);
        });

        it("fetchFacetexture.fulfilled deve popular class e facetexture e desligar loading", () => {
            const action = {
                type: fetchFacetexture.fulfilled.type,
                payload: {
                    classes: { class: [{ id: 1, name: "Warrior" }] },
                    characters: [{ id: 1, name: "Char1" }],
                },
            };

            const result = reducer(initialState, action);

            expect(result.loading).toBe(false);
            expect(result.class).toEqual([{ id: 1, name: "Warrior" }]);
            expect(result.facetexture).toEqual([{ id: 1, name: "Char1" }]);
        });

        it("fetchFacetexture.rejected deve marcar loading false e error true", () => {
            const result = reducer(initialState, { type: fetchFacetexture.rejected.type });

            expect(result.loading).toBe(false);
            expect(result.error).toBe(true);
        });
    });
});
