import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import loadingReducer, { setLoading, setupLoading } from "./index";
import { LoadingState } from "./types"; // Assuming you have a types file for LoadingState

describe("loadingSlice", () => {
    let store: ReturnType<typeof configureStore>;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                loading: loadingReducer,
            },
            middleware: [thunk],
        });
    });

    test("should handle initial state", () => {
        const initialState: LoadingState = {
            global: false,
            slices: {},
            effects: {},
            requests: {},
        };
        expect(store.getState().loading).toEqual(initialState);
    });

    test("should handle setLoading action", () => {
        const newState: LoadingState = {
            global: true,
            slices: { slice1: "starting" },
            effects: { effect1: "starting" },
            requests: { effect1: [] },
        };
        store.dispatch(setLoading(newState));
        expect(store.getState().loading).toEqual(newState);
    });

    test("should handle setupLoading thunk", async () => {
        const services = {
            service1: { typePrefix: "slice1/effect1" },
            service2: { typePrefix: "slice2/effect2" },
        };

        await store.dispatch(setupLoading(services) as any);

        const expectedState: LoadingState = {
            global: false,
            slices: { slice1: "starting", slice2: "starting" },
            effects: { "slice1/effect1": "starting", "slice2/effect2": "starting" },
            requests: { "slice1/effect1": [], "slice2/effect2": [] },
        };

        expect(store.getState().loading).toEqual(expectedState);
    });
});
