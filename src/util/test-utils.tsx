import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PropsWithChildren } from "react";

import { store as storeDefault } from "@/lib/store";

import { Provider } from "react-redux";

import { AppStore, RootState } from "@/lib/store";
import { PreloadedStateShapeFromReducersMapObject } from "@reduxjs/toolkit";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
    preloadedState?: PreloadedStateShapeFromReducersMapObject<RootState>;
    store?: AppStore;
}

export function createTestStore(preloadedState?: PreloadedStateShapeFromReducersMapObject<RootState>): AppStore {
    return storeDefault();
}

export function renderWithProviders(
    ui: React.ReactElement,
    {
        store = createTestStore(),
        ...renderOptions
    }: ExtendedRenderOptions = {},
) {
    function Wrapper({ children }: PropsWithChildren<{}>) {
        return <Provider store={store}>{children}</Provider>;
    }

    return {
        store,
        user: userEvent.setup(),
        ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    };
}
