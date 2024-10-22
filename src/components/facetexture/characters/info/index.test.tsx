import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Info from "./index";
import { RootState } from "@/lib/store";
import { changeClassCharacterThunk, changeShowClassThunk, deleteCharacterThunk } from "@/services/facetexture";
import { updateFacetextureUrlReducer } from "@/lib/features/facetexture";
import { message } from "antd";

jest.mock("@/services/facetexture", () => ({
    changeClassCharacterThunk: jest.fn(),
    changeShowClassThunk: jest.fn(),
    deleteCharacterThunk: jest.fn(),
}));

jest.mock("@/lib/features/facetexture", () => ({
    updateFacetextureUrlReducer: jest.fn(),
}));

jest.mock("antd", () => {
    const originalModule = jest.requireActual("antd");
    return {
        ...originalModule,
        message: {
            loading: jest.fn(),
            success: jest.fn(),
            error: jest.fn(),
        },
    };
});

const mockStore = configureStore([]);
const initialState: RootState = {
    facetexture: {
        selected: 1,
        facetexture: [
            {
                id: 1,
                image: "test-image-url",
                name: "Test Character",
                class: { id: 1, name: "Warrior" },
                show: true,
            },
        ],
        class: [
            { id: 1, name: "Warrior" },
            { id: 2, name: "Mage" },
        ],
    },
};

describe("Info Component", () => {
    let store;

    beforeEach(() => {
        store = mockStore(initialState);
    });

    it("should render character properties", () => {
        render(
            <Provider store={store}>
                <Info />
            </Provider>,
        );

        expect(screen.getByText("Propriedades")).toBeInTheDocument();
        expect(screen.getByText("Imagem atual do personagem")).toBeInTheDocument();
        expect(screen.getByAltText("Test Character")).toBeInTheDocument();
        expect(screen.getByText("Classe do personagem")).toBeInTheDocument();
        expect(screen.getByText("Mostrar icone da classe")).toBeInTheDocument();
        expect(screen.getByText("Facetexture do jogo")).toBeInTheDocument();
        expect(screen.getByText("Upload")).toBeInTheDocument();
        expect(screen.getByText("Deletar personagem")).toBeInTheDocument();
    });

    it("should dispatch changeClassCharacterThunk on class change", () => {
        render(
            <Provider store={store}>
                <Info />
            </Provider>,
        );

        fireEvent.change(screen.getByRole("combobox"), { target: { value: 2 } });

        expect(changeClassCharacterThunk).toHaveBeenCalledWith({ id: 1, classId: 2 });
    });

    it("should dispatch changeShowClassThunk on checkbox change", () => {
        render(
            <Provider store={store}>
                <Info />
            </Provider>,
        );

        fireEvent.click(screen.getByRole("checkbox"));

        expect(changeShowClassThunk).toHaveBeenCalledWith({ id: 1, visible: false });
    });

    it("should dispatch deleteCharacterThunk on delete button click", () => {
        render(
            <Provider store={store}>
                <Info />
            </Provider>,
        );

        fireEvent.click(screen.getByText("Deletar personagem"));

        expect(deleteCharacterThunk).toHaveBeenCalledWith(1);
    });

    it("should show loading message on class change", () => {
        render(
            <Provider store={store}>
                <Info />
            </Provider>,
        );

        fireEvent.change(screen.getByRole("combobox"), { target: { value: 2 } });

        expect(message.loading).toHaveBeenCalledWith({
            content: "Atualizando classe",
            key: "FACETEXTURE_MESSAGE_REF",
        });
    });

    it("should show loading message on delete character", () => {
        render(
            <Provider store={store}>
                <Info />
            </Provider>,
        );

        fireEvent.click(screen.getByText("Deletar personagem"));

        expect(message.loading).toHaveBeenCalledWith({
            content: "Excluindo personagem",
            key: "FACETEXTURE_MESSAGE_REF",
        });
    });
});
