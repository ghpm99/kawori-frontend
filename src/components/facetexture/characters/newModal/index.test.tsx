import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import NewModal from "./index";
import { RootState } from "@/lib/store";

const mockStore = configureStore([]);
const initialState: RootState = {
    facetexture: {
        modal: {
            newFacetexture: {
                visible: true,
                saving: false,
                data: {
                    classId: 0,
                    name: "",
                    visible: false,
                },
            },
        },
        class: [
            { id: 1, name: "Warrior" },
            { id: 2, name: "Mage" },
        ],
    },
};

describe("NewModal Component", () => {
    let store;

    beforeEach(() => {
        store = mockStore(initialState);
    });

    test("renders without crashing", () => {
        render(
            <Provider store={store}>
                <NewModal toggleVisible={jest.fn()} />
            </Provider>,
        );

        expect(screen.getByText("Criar novo personagem")).toBeInTheDocument();
    });

    test("disables OK button when classId is 0 and name length is <= 5", () => {
        render(
            <Provider store={store}>
                <NewModal toggleVisible={jest.fn()} />
            </Provider>,
        );

        expect(screen.getByRole("button", { name: /ok/i })).toBeDisabled();
    });

    test("enables OK button when classId is valid and name length is > 5", () => {
        const customState = {
            ...initialState,
            facetexture: {
                ...initialState.facetexture,
                modal: {
                    newFacetexture: {
                        ...initialState.facetexture.modal.newFacetexture,
                        data: {
                            classId: 1,
                            name: "ValidName",
                            visible: false,
                        },
                    },
                },
            },
        };
        store = mockStore(customState);

        render(
            <Provider store={store}>
                <NewModal toggleVisible={jest.fn()} />
            </Provider>,
        );

        expect(screen.getByRole("button", { name: /ok/i })).toBeEnabled();
    });

    test("calls updateCharacterClass on class select change", () => {
        render(
            <Provider store={store}>
                <NewModal toggleVisible={jest.fn()} />
            </Provider>,
        );

        fireEvent.change(screen.getByRole("combobox"), { target: { value: 1 } });
        expect(store.getActions()).toContainEqual({
            type: "facetexture/updateFacetextureClassModalReducer",
            payload: { classId: 1 },
        });
    });

    test("calls updateCharacterShowClass on checkbox change", () => {
        render(
            <Provider store={store}>
                <NewModal toggleVisible={jest.fn()} />
            </Provider>,
        );

        fireEvent.click(screen.getByRole("checkbox"));
        expect(store.getActions()).toContainEqual({
            type: "facetexture/updateFacetextureVisibleClassModalReducer",
            payload: { visible: true },
        });
    });

    test("calls updateImageSelectedCharacter on file upload", () => {
        render(
            <Provider store={store}>
                <NewModal toggleVisible={jest.fn()} />
            </Provider>,
        );

        const file = new File(["dummy content"], "example.png", { type: "image/png" });
        fireEvent.change(screen.getByLabelText(/upload/i), {
            target: { files: [file] },
        });

        expect(store.getActions()).toContainEqual({
            type: "facetexture/updateFacetextureImageNameModalReducer",
            payload: { name: "example.png" },
        });
    });
});
