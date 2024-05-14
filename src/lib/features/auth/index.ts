import { apiDjango } from "@/services";
import { signinThunk } from "@/services/auth";

import TokenService, { IToken } from "@/services/auth/authToken";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAuthState {
    user: IUser;
    status: "authenticated" | "unauthenticated";
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
            state.status = "unauthenticated";
            state.user = initialState.user;
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
                        access: action.payload.response.data.tokens.access,
                        refresh: action.payload.response.data.tokens.refresh,
                    },
                    remember: action.payload.args.remember,
                });
                state.status = "authenticated";
            })
            .addCase(userDetailsThunk.fulfilled, (state, action) => {
                console.log("userDetailsThunk", action.payload);
                state.user = action.payload;
            });
    },
});

export const { setToken, signout } = authSlice.actions;

export default authSlice.reducer;
