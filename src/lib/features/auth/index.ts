import { signinControlledRequest } from "@/services/auth"
import { IToken } from "@/services/auth/authToken";
import { IUser } from "@/services/profile";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import build from "next/dist/build"
import State from "pusher-js/types/src/core/http/state"

interface IAuthState {
    token: IToken;
    user: IUser;
    status: "authenticated" | "unauthenticated";
}

const initialState: IAuthState = {
    token: {
        tokens: {
            refresh: "",
            access: "",
        },
        remember: false,
    },
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

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<IToken>) => {
            state.token = action.payload;
        },
        signout : (state) => {
            state = initialState
        }
    },
    extraReducers: (builder) => {
        builder.addCase(signinControlledRequest.asyncThunk.pending, (state) => {
            state.status = "unauthenticated";
        })
        .addCase(signinControlledRequest.asyncThunk.fulfilled, (state, action) => {

        })
    }
});

export const { setToken, signout } = authSlice.actions;

export default authSlice.reducer;
