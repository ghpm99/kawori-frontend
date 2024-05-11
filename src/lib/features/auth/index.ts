import { signinControlledRequest } from "@/services/auth"
import TokenService, { IToken } from '@/services/auth/authToken'
import { IUser } from "@/services/profile"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IAuthState {
    user: IUser;
    status: "authenticated" | "unauthenticated";
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
            })
            state.status = "authenticated"
        },
        signout : (state) => {
            state.status = 'unauthenticated'
            state.user = initialState.user
        }
    },
    extraReducers: (builder) => {
        builder.addCase(signinControlledRequest.asyncThunk.pending, (state) => {
            state.status = "unauthenticated";
        })
        .addCase(signinControlledRequest.asyncThunk.fulfilled, (state, action) => {
            TokenService.setUser({
                tokens: {
                    access: action.payload.data.tokens.access,
                    refresh: action.payload.data.tokens.refresh,
                },
                remember: action.payload.args.remember,
            })
            state.status = "authenticated"
        })
    }
});

export const { setToken,signout } = authSlice.actions;

export default authSlice.reducer;
