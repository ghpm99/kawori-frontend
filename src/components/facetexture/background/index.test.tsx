import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Background from "./index";
import { RootState } from "@/lib/store";

const mockStore = configureStore([]);

describe("Background Component", () => {
    let store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        const initialState: RootState = {
            facetexture: {
                backgroundUrl: "test-url",
            },
            // Add other initial states if necessary
        };
        store = mockStore(initialState);
    });

    test("renders Background component", () => {
        render(
            <Provider store={store}>
                <Background />
            </Provider>,
        );

        expect(screen.getByText("Background")).toBeInTheDocument();
        expect(screen.getByAltText("background")).toHaveAttribute("src", "test-url");
        expect(screen.getByText("Clique ou arraste o arquivo para esta área para fazer upload")).toBeInTheDocument();
    });

    test("uploads new background", async () => {
        render(
            <Provider store={store}>
                <Background />
            </Provider>,
        );

        const file = new File(["dummy content"], "example.png", { type: "image/png" });
        const input = screen.getByLabelText(/Clique ou arraste o arquivo para esta área para fazer upload/i);

        Object.defineProperty(input, "files", {
            value: [file],
        });

        fireEvent.change(input);

        // Add assertions to check if the file upload logic works as expected
        // For example, you can mock the db.background.update and dispatch functions
    });
});
