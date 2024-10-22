import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import DragAndDropCharacters from "./index";
import { RootState } from "@/lib/store";
import { reorderCharacterThunk, setSelectedFacetextureReducer } from "@/lib/features/facetexture";

const mockStore = configureStore([]);
const initialState: RootState = {
    facetexture: {
        facetexture: [
            { id: 1, name: "Character 1", image: "image1.png", order: 0 },
            { id: 2, name: "Character 2", image: "image2.png", order: 1 },
            // Add more characters as needed
        ],
    },
    // Add other slices of state as needed
};

describe("DragAndDropCharacters", () => {
    let store;

    beforeEach(() => {
        store = mockStore(initialState);
        store.dispatch = jest.fn();
    });

    it("renders characters correctly", () => {
        const { getByAltText } = render(
            <Provider store={store}>
                <DragAndDropCharacters />
            </Provider>,
        );

        expect(getByAltText("Character 1")).toBeInTheDocument();
        expect(getByAltText("Character 2")).toBeInTheDocument();
    });

    it("dispatches reorderCharacterThunk on drag end", () => {
        const { container } = render(
            <Provider store={store}>
                <DragAndDropCharacters />
            </Provider>,
        );

        const dragDropContext = container.querySelector(".characters-container");
        const draggableItem = container.querySelector(".character");

        fireEvent.dragStart(draggableItem);
        fireEvent.dragEnter(dragDropContext);
        fireEvent.dragOver(dragDropContext);
        fireEvent.drop(dragDropContext);

        expect(store.dispatch).toHaveBeenCalledWith(
            reorderCharacterThunk({
                id: 1,
                indexDestination: 0,
            }),
        );
    });

    it("dispatches setSelectedFacetextureReducer on character click", () => {
        const { getByAltText } = render(
            <Provider store={store}>
                <DragAndDropCharacters />
            </Provider>,
        );

        const character = getByAltText("Character 1");
        fireEvent.click(character);

        expect(store.dispatch).toHaveBeenCalledWith(setSelectedFacetextureReducer(1));
    });
});
