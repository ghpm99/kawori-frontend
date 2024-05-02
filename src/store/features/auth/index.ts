import { IUser } from "@/services/profile"
import { createSlice } from "@reduxjs/toolkit";

interface IAuthState {
    token: string | undefined;
    user: IUser
}


export const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: undefined,
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
            last_login: new Date(),
            date_joined: new Date(),
        }
    } as IAuthState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
    },
});

export const { setToken } = authSlice.actions;

export default authSlice.reducer;
