import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
    changeClassCharacterThunk,
    fetchFaceTextureClassService,
    fetchFacetextureService,
    newCharacterThunk,
} from "../../../services/facetexture";

const initialState: IFacetextureState = {
    loading: true,
    backgroundUrl: "",
    class: [],
    facetexture: [],
    selected: undefined,
    edited: false,
    error: false,
};

export const fetchFacetexture = createAsyncThunk("facetexture/fetchFacetexture", async () => {
    const classes = await fetchFaceTextureClassService();
    const response = await fetchFacetextureService();
    const characters = response.characters.map((item) => ({
        ...item,
        image: item.class.class_image,
    }));
    return { characters, classes };
});

export const facetextureSlice = createSlice({
    name: "facetexture",
    initialState,
    reducers: {
        updateFacetextureUrlReducer: (state: IFacetextureState, action: PayloadAction<IUpdateFacetextureUrlAction>) => {
            const index = state.facetexture.findIndex((face) => face.id === action.payload.id);
            state.facetexture[index].image = action.payload.image;
        },
        updateBackgroundReducer: (state: IFacetextureState, action: PayloadAction<string>) => {
            state.backgroundUrl = action.payload;
        },
        setSelectedFacetextureReducer: (state: IFacetextureState, action: PayloadAction<number>) => {
            state.selected = action.payload;
        },
        reorderCharacterReducer: (state: IFacetextureState, action: PayloadAction<IReorderCharacterAction>) => {
            let newFacetextureList = state.facetexture.filter((item, index) => index !== action.payload.indexSource);
            newFacetextureList.splice(action.payload.indexDestination, 0, state.facetexture[action.payload.indexSource]);
            state.facetexture = newFacetextureList;
        },
        updateCharacterClassReducer: (state: IFacetextureState, action: PayloadAction<IUpdateCharacterClassAction>) => {
            const newClass = state.class.find((item) => item.id === action.payload.class);

            if (!newClass) {
                return;
            }
            state.facetexture[action.payload.index].class = newClass;
            state.facetexture[action.payload.index].image = newClass.class_image;
            state.edited = true;
        },
        deleteCharacterReducer: (state: IFacetextureState, action: PayloadAction<number>) => {
            let newFacetextureList = state.facetexture.filter((_, index) => index !== action.payload);
            state.facetexture = newFacetextureList;
            state.edited = true;
        },
        updateCharacterShowClassReducer: (state: IFacetextureState, action: PayloadAction<IUpdateCharacterShowClassAction>) => {
            state.facetexture[action.payload.index].show = action.payload.show;
            state.edited = true;
        },
        setFacetextureIsEdited: (state: IFacetextureState, action: PayloadAction<boolean>) => {
            state.edited = action.payload;
        },
        updateCharacterImageNameReducer: (state: IFacetextureState, action: PayloadAction<IUpdateCharacterImageNameAction>) => {
            state.facetexture[action.payload.index].name = action.payload.name;
            state.edited = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFacetexture.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(fetchFacetexture.fulfilled, (state, action) => {
                state.class = action.payload.classes.class;
                state.facetexture = action.payload.characters;
                state.loading = false;
            })
            .addCase(fetchFacetexture.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
            })
            .addCase(changeClassCharacterThunk.fulfilled, (state, action) => {
                const facetextureIndex = state.facetexture.findIndex((item) => item.id === action.payload.id);
                state.facetexture[facetextureIndex].class = action.payload.data.class;
                state.facetexture[facetextureIndex].image = action.payload.data.class.class_image;
            })
            .addCase(newCharacterThunk.fulfilled, (state, action) => {
                state.facetexture.push(action.payload.character);
            });
    },
});

export const {
    updateFacetextureUrlReducer,
    updateBackgroundReducer,
    setSelectedFacetextureReducer,
    reorderCharacterReducer,
    updateCharacterClassReducer,
    deleteCharacterReducer,
    updateCharacterShowClassReducer,
    setFacetextureIsEdited,
    updateCharacterImageNameReducer,
} = facetextureSlice.actions;

export default facetextureSlice.reducer;
