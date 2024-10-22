import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Preview from "./index";
import { RootState } from "@/lib/store";
import { db } from "@/util/db";
import { previewFacetextureService, downloadFacetextureService } from "@/services/facetexture";

jest.mock("@/util/db");
jest.mock("@/services/facetexture");
jest.mock("@sentry/nextjs");

const mockStore = configureStore([]);
const initialState: RootState = {
    facetexture: {
        facetexture: [],
    },
};

describe("Preview Component", () => {
    let store;

    beforeEach(() => {
        store = mockStore(initialState);
        (db.background.toArray as jest.Mock).mockResolvedValue([{ image: "test-image" }]);
    });

    test("renders the Preview component", () => {
        render(
            <Provider store={store}>
                <Preview />
            </Provider>,
        );

        expect(screen.getByText("Preview")).toBeInTheDocument();
        expect(screen.getByText("Atualizar")).toBeInTheDocument();
        expect(screen.getByText("Baixar")).toBeInTheDocument();
    });

    test('updates preview background on "Atualizar" button click', async () => {
        (previewFacetextureService as jest.Mock).mockResolvedValue(new Blob());

        render(
            <Provider store={store}>
                <Preview />
            </Provider>,
        );

        const updateButton = screen.getByText("Atualizar");
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(previewFacetextureService).toHaveBeenCalledWith({ background: "test-image" });
            expect(screen.getByAltText("preview-background")).toBeInTheDocument();
        });
    });

    test('downloads facetexture on "Baixar" button click', async () => {
        (downloadFacetextureService as jest.Mock).mockResolvedValue(new Blob());

        render(
            <Provider store={store}>
                <Preview />
            </Provider>,
        );

        const downloadButton = screen.getByText("Baixar");
        fireEvent.click(downloadButton);

        await waitFor(() => {
            expect(downloadFacetextureService).toHaveBeenCalledWith({ background: "test-image" });
        });
    });

    test("disables buttons when facetextureStore is empty", () => {
        render(
            <Provider store={store}>
                <Preview />
            </Provider>,
        );

        const updateButton = screen.getByText("Atualizar");
        const downloadButton = screen.getByText("Baixar");

        expect(updateButton).toBeDisabled();
        expect(downloadButton).toBeDisabled();
    });
});
