import { MenuItemKey } from "@/components/menuInternal/Index";
import { apiDjango } from "@/services";
import { signinThunk, userDetailThunk, verifyTokenThunk } from "@/services/auth";

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

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        signin: (state) => {
            state.status = "authenticated";
        },
        signout: (state) => {
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
                state.status = "authenticated";
            })
            .addCase(signinThunk.rejected, (state) => {
                state.status = "unauthenticated";
            })
            .addCase(userDetailThunk.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(verifyTokenThunk.pending, (state) => {
                state.status = "unauthenticated";
            })
            .addCase(verifyTokenThunk.fulfilled, (state) => {
                state.status = "authenticated";
            })
            .addCase(verifyTokenThunk.rejected, (state) => {
                state.status = "unauthenticated";
            });
    },
});

export const { signin, signout, setLoading, setSelectedMenu } = authSlice.actions;

export default authSlice.reducer;
