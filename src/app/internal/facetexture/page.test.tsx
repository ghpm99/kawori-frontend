import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import FaceTexture from "./page";
import { RootState } from "@/lib/store";
import { setSelectedMenu, fetchFacetexture } from "@/lib/features/auth";
import { updateBackgroundReducer, updateFacetextureUrlReducer } from "@/lib/features/facetexture";
import { db } from "@/util/db";

jest.mock("@/util/db", () => ({
    db: {
        background: {
            toArray: jest.fn(),
            add: jest.fn(),
        },
        image: {
            where: jest.fn(() => ({
                equals: jest.fn(() => ({
                    first: jest.fn(),
                })),
            })),
        },
    },
}));

jest.mock("antd", () => ({
    Breadcrumb: ({ items }) => <div>{items.map((item) => item.title).join(" > ")}</div>,
    message: {
        loading: jest.fn(),
        success: jest.fn(),
    },
}));

jest.mock("@/components/facetexture/background", () => {
    const Background = () => <div>Background Component</div>;
    Background.displayName = "Background";
    return Background;
});

jest.mock("@/components/facetexture/characters", () => {
    const Characters = () => <div>Characters Component</div>;
    Characters.displayName = "Characters";
    return Characters;
});

jest.mock("@/components/facetexture/loading", () => {
    const Loading = () => <div>Loading Component</div>;
    Loading.displayName = "Loading";
    return Loading;
});

jest.mock("@/components/facetexture/preview", () => {
    const Preview = () => <div>Preview Component</div>;
    Preview.displayName = "Preview";
    return Preview;
});

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("FaceTexture", () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            facetexture: {
                loading: false,
                characters: [],
                background: "",
            },
        });
    });

    test("should render the component", () => {
        render(
            <Provider store={store}>
                <FaceTexture />
            </Provider>,
        );

        expect(screen.getByText("Home > Kawori > Facetexture")).toBeInTheDocument();
        expect(screen.getByText("Background Component")).toBeInTheDocument();
        expect(screen.getByText("Characters Component")).toBeInTheDocument();
        expect(screen.getByText("Preview Component")).toBeInTheDocument();
    });

    test("should dispatch actions on mount", async () => {
        render(
            <Provider store={store}>
                <FaceTexture />
            </Provider>,
        );

        await waitFor(() => {
            const actions = store.getActions();
            expect(actions).toContainEqual(setSelectedMenu(["facetexture"]));
            expect(actions).toContainEqual(fetchFacetexture());
        });
    });

    test("should show loading message when loading", () => {
        store = mockStore({
            facetexture: {
                loading: true,
                characters: [],
                background: "",
            },
        });

        render(
            <Provider store={store}>
                <FaceTexture />
            </Provider>,
        );

        expect(screen.getByText("Loading Component")).toBeInTheDocument();
    });

    test("should update background image", async () => {
        db.background.toArray.mockResolvedValueOnce([{ image: new Blob() }]);
        render(
            <Provider store={store}>
                <FaceTexture />
            </Provider>,
        );

        await waitFor(() => {
            const actions = store.getActions();
            expect(actions).toContainEqual(updateBackgroundReducer(expect.any(String)));
        });
    });

    test("should update character image", async () => {
        db.image.where().equals().first.mockResolvedValueOnce({ imagem: new Blob() });
        render(
            <Provider store={store}>
                <FaceTexture />
            </Provider>,
        );

        await waitFor(() => {
            const actions = store.getActions();
            expect(actions).toContainEqual(updateFacetextureUrlReducer(expect.any(Object)));
        });
    });
});
