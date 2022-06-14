import { configureStore } from '@reduxjs/toolkit'
import statusReducer from './features/status/Index'
import commonReducer from './features/common/Index'
import financialReducer from './features/financial/Index'

export const store = configureStore({
	reducer: {
		status: statusReducer,
		common: commonReducer,
		financial: financialReducer,
	},
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch