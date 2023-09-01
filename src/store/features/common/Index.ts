import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: undefined,
};

export const commonSlice = createSlice({
    name: "common",
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
    },
});

export const { setToken } = commonSlice.actions;

export default commonSlice.reducer;
