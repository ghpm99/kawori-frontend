import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
    fetchFaceTextureClassService,
    fetchFacetextureService
} from '../../../services/facetextureService'

const initialState: IFacetextureState = {
	loading: true,
	backgroundUrl: '',
	class: [],
	facetexture: [],
	selected: undefined,
}

export const fetchFacetextureClass = createAsyncThunk(
	'facetexture/fetchFacetextureClass',
	async () => {
		const response = await fetchFaceTextureClassService()
		return response
	}
)

export const fetchFacetexture = createAsyncThunk(
	'facetexture/fetchFacetexture',
	async () => {
		const response = await fetchFacetextureService()
		const characters = response.characters.map(item => {

            const image = process.env.NEXT_PUBLIC_API_URL + item.class.class_image

			return {
				...item,
                image: image
			}
		})
		return characters
	}
)

export const facetextureSlice = createSlice({
	name: 'facetexture',
	initialState,
	reducers: {
        updateFacetextureUrlReducer : (state:IFacetextureState, action) => {
            state.facetexture.find(item => item.id === action.payload.id).image = action.payload.image
        },
        updateBackgroundReducer : (state: IFacetextureState, action: PayloadAction<string>) => {
            state.backgroundUrl = action.payload
        },
        setSelectedFacetextureReducer: (state: IFacetextureState, action) => {
            state.selected = action.payload
        },
        reorderCharacterReducer: (state:IFacetextureState, action: PayloadAction<IReorderCharacterAction>) => {
            let newFacetextureList = state.facetexture.filter(item => item.id !== action.payload.facetexture.id)
            newFacetextureList.splice(action.payload.newOrder, 0, action.payload.facetexture)
			newFacetextureList = newFacetextureList.map((item, index) => ({
				...item,
				order: index
			}))
            state.facetexture = newFacetextureList.sort((a, b) => a.order - b.order)
        },
		includeNewCharacterReducer: (state:IFacetextureState) => {
			const lastFacetexture = Math.max(...state.facetexture.map(item => item.order)) + 1
			state.facetexture.push({
				id: lastFacetexture,
				image: '/facetexture/default.png',
				order: lastFacetexture,
				name: 'default.png',
				show: true,
				class: state.class[0]
			})
		},
    },
	extraReducers: (builder) => {
		builder
			.addCase(fetchFacetextureClass.fulfilled, (state, action) => {
				state.class = action.payload.class
			})
			.addCase(fetchFacetexture.pending, (state) => {
				state.loading = true
			})
			.addCase(fetchFacetexture.fulfilled, (state, action) => {
				state.facetexture = action.payload.sort((a, b) => a.order - b.order)
				state.loading = false
			})
	},
})

export const {
    updateFacetextureUrlReducer,
    updateBackgroundReducer,
    setSelectedFacetextureReducer,
    reorderCharacterReducer,
	includeNewCharacterReducer,
} = facetextureSlice.actions

export default facetextureSlice.reducer
