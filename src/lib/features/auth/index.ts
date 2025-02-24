import { MenuItemKey } from "@/components/menuInternal/Index";
import { apiDjango } from "@/services";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type authStatus = "authenticated" | "unauthenticated";

interface IAuthState {
    user: IUser;
    status: authStatus;
    loading: boolean;
    selectedMenu: MenuItemKey[];
    groups: string[]
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

interface IUserData {
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
    groups: []
};

export const signinThunk = createAsyncThunk(
    "auth/signin",
    async (args: { username: string; password: string; remember: boolean }) => {
        const response = await apiDjango.post<{ msg: string }>("auth/token/", args);
        return response.data;
    },
);

export const userDetailThunk = createAsyncThunk("profile/userDetail", async () => {
    const response = await apiDjango.get<IUserData>("profile/");
    return response.data;
});

export const userGroupsThunk = createAsyncThunk("profile/userGroups", async () => {
    const response = await apiDjango.get<{data: string[]}>("profile/groups/");
    return response.data;
});

export const verifyTokenThunk = createAsyncThunk("auth/verify", async () => {
    const response = await apiDjango.post("auth/token/verify/");
    return response.data;
});

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
            .addCase(userDetailThunk.rejected, (state, action) => {
                state.status = "unauthenticated";
            })
            .addCase(verifyTokenThunk.pending, (state) => {
                state.status = "unauthenticated";
            })
            .addCase(verifyTokenThunk.fulfilled, (state) => {
                state.status = "authenticated";
            })
            .addCase(verifyTokenThunk.rejected, (state) => {
                state.status = "unauthenticated";
            })
            .addCase(userGroupsThunk.fulfilled, (state, action) => {
                state.groups = action.payload.data
            })
    },
});

export const { signin, signout, setLoading, setSelectedMenu } = authSlice.actions;

export default authSlice.reducer;
