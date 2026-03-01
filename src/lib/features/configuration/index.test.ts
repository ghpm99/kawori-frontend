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

import reducer, { configurationSlice } from "./index";
import { getAllBdoClass } from "@/services/classification";

const initialState = configurationSlice.getInitialState();

describe("configuration slice", () => {
    describe("estado inicial", () => {
        it("deve ter class vazio", () => {
            expect(initialState.class).toEqual([]);
        });
    });

    describe("extraReducers", () => {
        it("getAllBdoClass.fulfilled deve popular lista de classes", () => {
            const classes = [
                { id: 1, name: "Warrior", class_image: "warrior.png" },
                { id: 2, name: "Sorceress", class_image: "sorceress.png" },
            ];

            const action = {
                type: getAllBdoClass.fulfilled.type,
                payload: { class: classes },
            };

            const result = reducer(initialState, action);

            expect(result.class).toEqual(classes);
            expect(result.class).toHaveLength(2);
        });
    });
});
