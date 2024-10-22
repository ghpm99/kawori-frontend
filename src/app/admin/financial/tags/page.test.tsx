import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import TagPage from "./page";
import { RootState } from "@/lib/store";
import { setSelectedMenu, fetchTags, changeVisibleModalTag } from "@/lib/features/financial/tag";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("TagPage", () => {
    let store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        const initialState: RootState = {
            financial: {
                tag: {
                    data: [],
                    loading: false,
                    modal: {
                        newTag: {
                            visible: false,
                        },
                    },
                },
            },
        } as any;

        store = mockStore(initialState);
        store.dispatch = jest.fn();
    });

    test("should render the page title", () => {
        render(
            <Provider store={store}>
                <TagPage />
            </Provider>,
        );

        expect(document.title).toBe("Kawori Tags");
        expect(screen.getByText("Valores em aberto")).toBeInTheDocument();
    });

    test("should dispatch setSelectedMenu and fetchTags on mount", () => {
        render(
            <Provider store={store}>
                <TagPage />
            </Provider>,
        );

        expect(store.dispatch).toHaveBeenCalledWith(setSelectedMenu(["financial", "tags"]));
        expect(store.dispatch).toHaveBeenCalledWith(fetchTags());
    });

    test("should open and close the new tag modal", () => {
        render(
            <Provider store={store}>
                <TagPage />
            </Provider>,
        );

        const newTagButton = screen.getByText("Novo");
        fireEvent.click(newTagButton);

        expect(store.dispatch).toHaveBeenCalledWith(changeVisibleModalTag({ modal: "newTag", visible: true }));

        // Simulate closing the modal
        store = mockStore({
            financial: {
                tag: {
                    data: [],
                    loading: false,
                    modal: {
                        newTag: {
                            visible: true,
                        },
                    },
                },
            },
        } as any);

        render(
            <Provider store={store}>
                <TagPage />
            </Provider>,
        );

        const modalCancelButton = screen.getByText("Cancel"); // Assuming the cancel button text is "Cancel"
        fireEvent.click(modalCancelButton);

        expect(store.dispatch).toHaveBeenCalledWith(changeVisibleModalTag({ modal: "newTag", visible: false }));
    });

    test("should render the table with data", () => {
        store = mockStore({
            financial: {
                tag: {
                    data: [
                        { id: 1, name: "Tag1", color: "red" },
                        { id: 2, name: "Tag2", color: "blue" },
                    ],
                    loading: false,
                    modal: {
                        newTag: {
                            visible: false,
                        },
                    },
                },
            },
        } as any);

        render(
            <Provider store={store}>
                <TagPage />
            </Provider>,
        );

        expect(screen.getByText("Tag1")).toBeInTheDocument();
        expect(screen.getByText("Tag2")).toBeInTheDocument();
    });
});
