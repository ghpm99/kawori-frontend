import { IToken } from "@/services/auth/authToken";
import { IUser } from "@/services/profile";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAuthState {
    token: IToken;
    user: IUser;
}

export const authSlice = createSlice({
    name: "auth",
    initialState: {
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
    } as IAuthState,
    reducers: {
        setToken: (state, action: PayloadAction<IToken>) => {
            state.token = action.payload;
        },
    },
});

export const { setToken } = authSlice.actions;

export default authSlice.reducer;
