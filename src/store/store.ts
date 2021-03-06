import { Action, configureStore, ThunkDispatch } from '@reduxjs/toolkit'
import statusReducer from './features/status/Index'
import commonReducer from './features/common/Index'
import financialReducer from './features/financial/Index'
import facetextureReducer from './features/facetexture'
import { useDispatch } from 'react-redux'

export const store = configureStore({
	reducer: {
		status: statusReducer,
		common: commonReducer,
		financial: financialReducer,
		facetexture: facetextureReducer,
	},
	devTools: process.env.NODE_ENV === 'development'
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>()

export type ThunkAppDispatch = ThunkDispatch<RootState, void, Action>

export const useAppThunkDispatch = (): ThunkAppDispatch =>
	useDispatch<ThunkAppDispatch>()