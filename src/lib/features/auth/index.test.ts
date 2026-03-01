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

import reducer, {
    signin,
    setLoading,
    setSelectedMenu,
    signinThunk,
    userDetailThunk,
    verifyTokenThunk,
    signoutThunk,
    authSlice,
    userGroupsThunk,
    refreshTokenThunk,
} from "./index";
import { LOCAL_STORE_ITEM_NAME } from "@/components/constants";

const initialState = authSlice.getInitialState();

describe("auth slice", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe("estado inicial", () => {
        it("deve ter status unauthenticated e loading true", () => {
            expect(initialState.status).toBe("unauthenticated");
            expect(initialState.loading).toBe(true);
        });

        it("deve ter usuário com valores padrão", () => {
            expect(initialState.user.id).toBe(0);
            expect(initialState.user.username).toBe("");
            expect(initialState.user.email).toBe("");
        });

        it("deve ter selectedMenu com 'home'", () => {
            expect(initialState.selectedMenu).toEqual(["home"]);
        });

        it("deve ter groups vazio", () => {
            expect(initialState.groups).toEqual([]);
        });
    });

    describe("reducers síncronos", () => {
        it("signin deve atualizar status para 'authenticated'", () => {
            const state = reducer(initialState, signin());
            expect(state.status).toBe("authenticated");
        });

        it("setLoading deve atualizar o valor de loading", () => {
            const state = reducer(initialState, setLoading(false));
            expect(state.loading).toBe(false);
        });

        it("setSelectedMenu deve atualizar o menu selecionado", () => {
            const state = reducer(initialState, setSelectedMenu(["financial"]));
            expect(state.selectedMenu).toEqual(["financial"]);
        });
    });

    describe("extraReducers", () => {
        it("signinThunk.fulfilled deve atualizar status e salvar token no localStorage", () => {
            const action = {
                type: signinThunk.fulfilled.type,
                payload: { refresh_token_expiration: "2024-12-31" },
            };

            const state = reducer(initialState, action);

            expect(state.status).toBe("authenticated");
            expect(localStorage.getItem(LOCAL_STORE_ITEM_NAME)).toBe("2024-12-31");
        });

        it("userDetailThunk.fulfilled deve popular dados do usuário", () => {
            const userData = {
                id: 1,
                name: "Test User",
                username: "testuser",
                first_name: "Test",
                last_name: "User",
                email: "test@example.com",
                is_staff: false,
                is_active: true,
                is_superuser: false,
                last_login: "2024-01-01",
                date_joined: "2023-01-01",
            };

            const action = {
                type: userDetailThunk.fulfilled.type,
                payload: userData,
            };

            const state = reducer(initialState, action);

            expect(state.user.id).toBe(1);
            expect(state.user.username).toBe("testuser");
            expect(state.user.email).toBe("test@example.com");
            expect(state.user.first_name).toBe("Test");
        });

        it("verifyTokenThunk.fulfilled deve marcar como authenticated e loading false", () => {
            const action = { type: verifyTokenThunk.fulfilled.type };

            const state = reducer(initialState, action);

            expect(state.status).toBe("authenticated");
            expect(state.loading).toBe(false);
        });

        it("refreshTokenThunk.fulfilled deve marcar como authenticated e loading false", () => {
            const action = { type: refreshTokenThunk.fulfilled.type };

            const state = reducer(initialState, action);

            expect(state.status).toBe("authenticated");
            expect(state.loading).toBe(false);
        });

        it("userGroupsThunk.fulfilled deve popular groups", () => {
            const action = {
                type: userGroupsThunk.fulfilled.type,
                payload: { data: ["admin", "editor"] },
            };

            const state = reducer(initialState, action);

            expect(state.groups).toEqual(["admin", "editor"]);
        });

        it("signoutThunk.fulfilled deve resetar state e limpar localStorage", () => {
            localStorage.setItem(LOCAL_STORE_ITEM_NAME, "some-token");

            const authenticatedState = {
                ...initialState,
                status: "authenticated" as const,
                user: { ...initialState.user, id: 1, username: "test" },
                groups: ["admin"],
            };

            const action = { type: signoutThunk.fulfilled.type };
            const state = reducer(authenticatedState, action);

            expect(state.status).toBe("unauthenticated");
            expect(state.user.id).toBe(0);
            expect(state.user.username).toBe("");
            expect(state.groups).toEqual([]);
            expect(localStorage.getItem(LOCAL_STORE_ITEM_NAME)).toBeNull();
        });
    });
});
