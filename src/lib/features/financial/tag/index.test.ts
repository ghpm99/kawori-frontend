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

import reducer, { financialSlice, changeVisibleModalTag, fetchTags } from "./index";

const initialState = financialSlice.getInitialState();

describe("financial tag slice", () => {
    describe("estado inicial", () => {
        it("deve ter data vazio e loading true", () => {
            expect(initialState.data).toEqual([]);
            expect(initialState.loading).toBe(true);
        });

        it("deve ter modal newTag com visible false", () => {
            expect(initialState.modal.newTag.visible).toBe(false);
            expect(initialState.modal.newTag.error).toBe(false);
            expect(initialState.modal.newTag.errorMsg).toBe("");
        });
    });

    describe("reducers síncronos", () => {
        it("changeVisibleModalTag deve alternar visibilidade do modal", () => {
            const result = reducer(
                initialState,
                changeVisibleModalTag({ modal: "newTag", visible: true }),
            );

            expect(result.modal.newTag.visible).toBe(true);
        });

        it("changeVisibleModalTag deve fechar o modal", () => {
            const openState = {
                ...initialState,
                modal: { ...initialState.modal, newTag: { ...initialState.modal.newTag, visible: true } },
            };

            const result = reducer(
                openState,
                changeVisibleModalTag({ modal: "newTag", visible: false }),
            );

            expect(result.modal.newTag.visible).toBe(false);
        });
    });

    describe("extraReducers", () => {
        it("fetchTags.pending deve marcar loading true", () => {
            const state = { ...initialState, loading: false };
            const result = reducer(state, { type: fetchTags.pending.type });

            expect(result.loading).toBe(true);
        });

        it("fetchTags.fulfilled deve popular data e desligar loading", () => {
            const tags = [{ id: 1, name: "Tag1" }, { id: 2, name: "Tag2" }];
            const action = {
                type: fetchTags.fulfilled.type,
                payload: { data: tags },
            };

            const result = reducer(initialState, action);

            expect(result.data).toEqual(tags);
            expect(result.loading).toBe(false);
        });
    });
});
