import { getAllBdoClass } from "@/services/classification";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MenuTheme } from "antd";

interface IConfigurationState {
    class: IClass[];
    theme: MenuTheme;
}

const initialState: IConfigurationState = {
    class: [],
    theme: "dark",
};

export const configurationSlice = createSlice({
    name: "configuration",
    initialState,
    reducers: {
        changeTheme: (state, action: PayloadAction<MenuTheme>) => {
            state.theme = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAllBdoClass.fulfilled, (state, action) => {
            state.class = action.payload.class;
        });
    },
});

export const { changeTheme } = configurationSlice.actions;

export default configurationSlice.reducer;
