import { getAllBdoClass } from "@/services/classification";
import { Theme } from "@/styles/theme";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IConfigurationState {
    class: IClass[];
    theme: Theme;
}

const initialState: IConfigurationState = {
    class: [],
    theme: "light",
};

export const configurationSlice = createSlice({
    name: "configuration",
    initialState,
    reducers: {
        changeTheme: (state, action: PayloadAction<Theme>) => {
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
