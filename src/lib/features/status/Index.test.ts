import reducer, { statusSlice, setCpuAndMemoryValue } from "./Index";

const initialState = statusSlice.getInitialState();

describe("status slice", () => {
    describe("estado inicial", () => {
        it("deve ter cpu e memory em 0", () => {
            expect(initialState.cpu).toBe(0);
            expect(initialState.memory).toBe(0);
        });
    });

    describe("reducers", () => {
        it("setCpuAndMemoryValue deve atualizar cpu e memory", () => {
            const result = reducer(initialState, setCpuAndMemoryValue({ cpu: 45.5, memory: 72.3 }));

            expect(result.cpu).toBe(45.5);
            expect(result.memory).toBe(72.3);
        });

        it("setCpuAndMemoryValue deve atualizar para zero", () => {
            const state = { cpu: 50, memory: 80 };
            const result = reducer(state, setCpuAndMemoryValue({ cpu: 0, memory: 0 }));

            expect(result.cpu).toBe(0);
            expect(result.memory).toBe(0);
        });
    });
});
