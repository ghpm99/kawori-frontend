import authReducer, { signout, IAuthState } from "./index";
import TokenService from "@/services/auth/authToken";
import authReducer, { signout, setToken, setLoading, setSelectedMenu, IAuthState, IUser } from "./index";

describe("authSlice", () => {
    describe("signout", () => {
        it("should set status to unauthenticated and reset user state", () => {
            const initialState: IAuthState = {
                user: {
                    id: 1,
                    name: "John Doe",
                    username: "johndoe",
                    first_name: "John",
                    last_name: "Doe",
                    email: "john.doe@example.com",
                    is_staff: true,
                    is_active: true,
                    is_superuser: true,
                    last_login: "2023-01-01T00:00:00Z",
                    date_joined: "2022-01-01T00:00:00Z",
                    image: "profile.jpg",
                },
                status: "authenticated",
                loading: false,
                selectedMenu: ["dashboard"],
            };

            const expectedState: IAuthState = {
                user: {
                    id: 0,
                    name: "",
                    username: "",
                    first_name: "",
                    last_name: "",
                    email: "",
                    is_staff: false,
                    is_active: false,
                    is_superuser: false,
                    last_login: "",
                    date_joined: "",
                },
                status: "unauthenticated",
                loading: true,
                selectedMenu: ["home"],
            };

            const action = signout();
            const state = authReducer(initialState, action);

            expect(state).toEqual(expectedState);
            expect(TokenService.removeUser).toHaveBeenCalled();
        });
    });

    describe("setToken", () => {
        it("should set the token and update the status to authenticated", () => {
            const initialState: IAuthState = {
                user: {
                    id: 0,
                    name: "",
                    username: "",
                    first_name: "",
                    last_name: "",
                    email: "",
                    is_staff: false,
                    is_active: false,
                    is_superuser: false,
                    last_login: "",
                    date_joined: "",
                },
                status: "unauthenticated",
                loading: true,
                selectedMenu: ["home"],
            };

            const tokenPayload = {
                tokens: {
                    access: "access-token",
                    refresh: "refresh-token",
                },
                remember: true,
            };

            const action = setToken(tokenPayload);
            const state = authReducer(initialState, action);

            expect(state.status).toBe("authenticated");
            expect(TokenService.setUser).toHaveBeenCalledWith({
                tokens: {
                    access: "access-token",
                    refresh: "refresh-token",
                },
                remember: true,
            });
        });
    });

    describe("setLoading", () => {
        it("should set the loading state", () => {
            const initialState: IAuthState = {
                user: {
                    id: 0,
                    name: "",
                    username: "",
                    first_name: "",
                    last_name: "",
                    email: "",
                    is_staff: false,
                    is_active: false,
                    is_superuser: false,
                    last_login: "",
                    date_joined: "",
                },
                status: "unauthenticated",
                loading: true,
                selectedMenu: ["home"],
            };

            const action = setLoading(false);
            const state = authReducer(initialState, action);

            expect(state.loading).toBe(false);
        });
    });

    describe("setSelectedMenu", () => {
        it("should set the selected menu", () => {
            const initialState: IAuthState = {
                user: {
                    id: 0,
                    name: "",
                    username: "",
                    first_name: "",
                    last_name: "",
                    email: "",
                    is_staff: false,
                    is_active: false,
                    is_superuser: false,
                    last_login: "",
                    date_joined: "",
                },
                status: "unauthenticated",
                loading: true,
                selectedMenu: ["home"],
            };

            const action = setSelectedMenu(["profile", "settings"]);
            const state = authReducer(initialState, action);

            expect(state.selectedMenu).toEqual(["profile", "settings"]);
        });
    });
});
