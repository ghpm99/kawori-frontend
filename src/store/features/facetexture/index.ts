import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
	fetchFaceTextureClassService,
	fetchFacetextureService,
} from '../../../services/facetextureService'

const initialState: IFacetextureState = {
	loading: true,
	backgroundUrl: '',
	class: [],
	facetexture: [],
	selected: undefined,
	edited: false,
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
		const characters = response.characters.map((item) => ({
				...item,
				image: item.class.class_image,
				upload: false,
			})
)
		return characters
	}
)

export const facetextureSlice = createSlice({
	name: 'facetexture',
	initialState,
	reducers: {
		updateFacetextureUrlReducer: (
			state: IFacetextureState,
			action: PayloadAction<IUpdateFacetextureUrlAction>
		) => {
			const facetextureIndex = state.facetexture.findIndex(
				(item) => item.id === action.payload.id
			)
			if (action.payload.upload) {
				state.facetexture[facetextureIndex].image = action.payload.image
				state.facetexture[facetextureIndex].upload = action.payload.upload
				state.edited = true
			} else if (!state.facetexture[facetextureIndex].upload) {
				state.facetexture[facetextureIndex].image = action.payload.image
				state.facetexture[facetextureIndex].upload = action.payload.upload
			}
		},
		updateBackgroundReducer: (
			state: IFacetextureState,
			action: PayloadAction<string>
		) => {
			state.backgroundUrl = action.payload
		},
		setSelectedFacetextureReducer: (state: IFacetextureState, action) => {
			state.selected = action.payload
		},
		reorderCharacterReducer: (
			state: IFacetextureState,
			action: PayloadAction<IReorderCharacterAction>
		) => {
			let newFacetextureList = state.facetexture.filter(
				(item) => item.id !== action.payload.facetexture.id
			)
			newFacetextureList.splice(
				action.payload.newOrder,
				0,
				action.payload.facetexture
			)
			newFacetextureList = newFacetextureList.map((item, index) => ({
				...item,
				order: index,
			}))
			state.facetexture = newFacetextureList.sort((a, b) => a.order - b.order)
			state.edited = true
		},
		includeNewCharacterReducer: (state: IFacetextureState) => {
			const lastFacetexture =
				Math.max(...state.facetexture.map((item) => item.order)) + 1
			state.facetexture.push({
				id: lastFacetexture,
				image: '/facetexture/default.png',
				order: lastFacetexture,
				name: `default${lastFacetexture}.png`,
				show: true,
				class: state.class[0],
				upload: false,
			})
			state.edited = true
		},
		updateCharacterClassReducer: (
			state: IFacetextureState,
			action: PayloadAction<IUpdateCharacterClassAction>
		) => {
			const facetextureIndex = state.facetexture.findIndex(
				(item) => item.id === action.payload.id
			)
			const newClass = state.class.find(
				(item) => item.id === action.payload.class
			)
			state.facetexture[facetextureIndex].class = newClass
			if (!state.facetexture[facetextureIndex].upload) {
				state.facetexture[facetextureIndex].image = newClass.class_image
			}
			state.edited = true
		},
		deleteCharacterReducer: (
			state: IFacetextureState,
			action: PayloadAction<number>
		) => {
			let newFacetextureList = state.facetexture.filter(item => item.id !== action.payload)
			newFacetextureList = newFacetextureList.map((item, index) => ({
				...item,
				order: index,
			}))
			state.facetexture = newFacetextureList.sort((a, b) => a.order - b.order)
			state.edited = true
		},
		updateCharacterShowClassReducer: (
			state: IFacetextureState,
			action: PayloadAction<IUpdateCharacterShowClassAction>
		) => {
			state.facetexture.find(item => item.id === action.payload.id).show = action.payload.show
			state.edited = true
		},
		setFacetextureIsEdited: (state: IFacetextureState, action: PayloadAction<boolean>) => {
			state.edited = action.payload
		}
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
	updateCharacterClassReducer,
	deleteCharacterReducer,
	updateCharacterShowClassReducer,
	setFacetextureIsEdited,
} = facetextureSlice.actions

export default facetextureSlice.reducer
