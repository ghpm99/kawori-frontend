import { MenuItemKey } from "@/components/menuInternal/Index";
import { apiDjango } from "@/services";
import { signinThunk } from "@/services/auth";

import TokenService, { IToken } from "@/services/auth/authToken";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type authStatus = "authenticated" | "unauthenticated";

interface IAuthState {
    user: IUser;
    status: authStatus;
    loading: boolean;
    selectedMenu: MenuItemKey[];
}

export interface IUser {
    id: number;
    name: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    is_staff: boolean;
    is_active: boolean;
    is_superuser: boolean;
    last_login: string;
    date_joined: string;
    image?: string;
}

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

export const userDetailsThunk = createAsyncThunk("profile/userDetails", async () => {
    const response = await apiDjango.get("/profile/");
    return response.data;
});

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state: IAuthState, action: PayloadAction<IToken>) => {
            TokenService.setUser({
                tokens: {
                    access: action.payload.tokens.access,
                    refresh: action.payload.tokens.refresh,
                },
                remember: action.payload.remember,
            });
            state.status = "authenticated";
        },
        signout: (state) => {
            TokenService.removeUser();
            state.user = initialState.user;
            state.status = "unauthenticated";
        },
        setLoading: (state: IAuthState, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setSelectedMenu: (state: IAuthState, action: PayloadAction<MenuItemKey[]>) => {
            state.selectedMenu = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signinThunk.pending, (state) => {
                state.status = "unauthenticated";
            })
            .addCase(signinThunk.fulfilled, (state, action) => {
                TokenService.setUser({
                    tokens: {
                        access: action.payload.token.tokens.access,
                        refresh: action.payload.token.tokens.refresh,
                    },
                    remember: action.payload.args.remember,
                });
                state.status = "authenticated";
                state.user = action.payload.user;
            })
            .addCase(userDetailsThunk.fulfilled, (state, action) => {
                state.user = action.payload;
            });
    },
});

export const { setToken, signout, setLoading, setSelectedMenu } = authSlice.actions;

export default authSlice.reducer;
