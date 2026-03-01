import { _registerEffect } from "./middleware";

const emptyState: LoadingState = {
    global: false,
    slices: {},
    effects: {},
    requests: {},
};

describe("_registerEffect", () => {
    describe("lifecycle pending", () => {
        it("deve marcar global como true", () => {
            const result = _registerEffect({
                initialState: emptyState,
                slice: "auth",
                effect: "auth/signin",
                lifecycle: "pending",
                requestId: "req-1",
            });

            expect(result.global).toBe(true);
        });

        it("deve marcar slice como 'pending'", () => {
            const result = _registerEffect({
                initialState: emptyState,
                slice: "auth",
                effect: "auth/signin",
                lifecycle: "pending",
                requestId: "req-1",
            });

            expect(result.slices["auth"]).toBe("pending");
        });

        it("deve marcar effect como 'pending'", () => {
            const result = _registerEffect({
                initialState: emptyState,
                slice: "auth",
                effect: "auth/signin",
                lifecycle: "pending",
                requestId: "req-1",
            });

            expect(result.effects["auth/signin"]).toBe("pending");
        });

        it("deve adicionar requestId ao array de requests do effect", () => {
            const result = _registerEffect({
                initialState: emptyState,
                slice: "auth",
                effect: "auth/signin",
                lifecycle: "pending",
                requestId: "req-1",
            });

            expect(result.requests["auth/signin"]).toContain("req-1");
        });
    });

    describe("lifecycle fulfilled", () => {
        it("deve remover requestId e marcar effect como 'idle'", () => {
            const stateWithPending: LoadingState = {
                global: true,
                slices: { auth: "pending" },
                effects: { "auth/signin": "pending" },
                requests: { "auth/signin": ["req-1"] },
            };

            const result = _registerEffect({
                initialState: stateWithPending,
                slice: "auth",
                effect: "auth/signin",
                lifecycle: "fulfilled",
                requestId: "req-1",
            });

            expect(result.requests["auth/signin"]).toEqual([]);
            expect(result.effects["auth/signin"]).toBe("idle");
        });

        it("deve marcar global como false quando não há mais requests ativos", () => {
            const stateWithPending: LoadingState = {
                global: true,
                slices: { auth: "pending" },
                effects: { "auth/signin": "pending" },
                requests: { "auth/signin": ["req-1"] },
            };

            const result = _registerEffect({
                initialState: stateWithPending,
                slice: "auth",
                effect: "auth/signin",
                lifecycle: "fulfilled",
                requestId: "req-1",
            });

            expect(result.global).toBe(false);
        });

        it("deve manter global true se ainda há requests de outro slice", () => {
            const stateWithMultiple: LoadingState = {
                global: true,
                slices: { auth: "pending", financial: "pending" },
                effects: { "auth/signin": "pending", "financial/fetchTags": "pending" },
                requests: { "auth/signin": ["req-1"], "financial/fetchTags": ["req-2"] },
            };

            const result = _registerEffect({
                initialState: stateWithMultiple,
                slice: "auth",
                effect: "auth/signin",
                lifecycle: "fulfilled",
                requestId: "req-1",
            });

            expect(result.global).toBe(true);
            expect(result.slices["auth"]).toBe("idle");
            expect(result.slices["financial"]).toBe("pending");
        });

        it("deve manter effect como pending se ainda há requests pendentes para ele", () => {
            const stateWithMultipleRequests: LoadingState = {
                global: true,
                slices: { auth: "pending" },
                effects: { "auth/signin": "pending" },
                requests: { "auth/signin": ["req-1", "req-2"] },
            };

            const result = _registerEffect({
                initialState: stateWithMultipleRequests,
                slice: "auth",
                effect: "auth/signin",
                lifecycle: "fulfilled",
                requestId: "req-1",
            });

            expect(result.effects["auth/signin"]).toBe("pending");
            expect(result.requests["auth/signin"]).toEqual(["req-2"]);
        });
    });

    describe("lifecycle rejected", () => {
        it("deve marcar effect como 'failed'", () => {
            const stateWithPending: LoadingState = {
                global: true,
                slices: { auth: "pending" },
                effects: { "auth/signin": "pending" },
                requests: { "auth/signin": ["req-1"] },
            };

            const result = _registerEffect({
                initialState: stateWithPending,
                slice: "auth",
                effect: "auth/signin",
                lifecycle: "rejected",
                requestId: "req-1",
            });

            expect(result.effects["auth/signin"]).toBe("failed");
        });

        it("deve marcar slice como 'failed' quando não há mais requests ativos", () => {
            const stateWithPending: LoadingState = {
                global: true,
                slices: { auth: "pending" },
                effects: { "auth/signin": "pending" },
                requests: { "auth/signin": ["req-1"] },
            };

            const result = _registerEffect({
                initialState: stateWithPending,
                slice: "auth",
                effect: "auth/signin",
                lifecycle: "rejected",
                requestId: "req-1",
            });

            expect(result.slices["auth"]).toBe("failed");
        });
    });

    describe("inicialização de slices/effects", () => {
        it("deve criar slice como 'starting' se não existir", () => {
            const result = _registerEffect({
                initialState: emptyState,
                slice: "newSlice",
                effect: "newSlice/action",
                lifecycle: "pending",
                requestId: "req-1",
            });

            expect(result.slices["newSlice"]).toBe("pending");
        });

        it("deve criar array de requests vazio se não existir", () => {
            const result = _registerEffect({
                initialState: emptyState,
                slice: "auth",
                effect: "auth/newAction",
                lifecycle: "pending",
                requestId: "req-1",
            });

            expect(result.requests["auth/newAction"]).toEqual(["req-1"]);
        });
    });
});
