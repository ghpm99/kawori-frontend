import { Action, ThunkDispatch, combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducer from "./features/auth";
import classificationReducer from "./features/classification";
import facetextureReducer from "./features/facetexture";
import contractReducer from "./features/financial/contract";
import contractDetailsReducer from "./features/financial/contract/detail";
import invoiceReducer from "./features/financial/invoice";
import invoiceDetailsReducer from "./features/financial/invoice/detail";
import overviewReducer from "./features/financial/overview";
import paymentReducer from "./features/financial/payment";
import paymentDetailsReducer from "./features/financial/payment/detail";
import tagReducer from "./features/financial/tag";
import statusReducer from "./features/status/Index";
import { LoadingMiddleware } from './features/loading'
import loadingReducer from './features/loading'

const financialStore = combineReducers({
    overview: overviewReducer,
    contract: contractReducer,
    contractDetail: contractDetailsReducer,
    invoice: invoiceReducer,
    invoiceDetail: invoiceDetailsReducer,
    payment: paymentReducer,
    paymentDetail: paymentDetailsReducer,
    tag: tagReducer,
});

export const store = configureStore({
    reducer: {
        loading: loadingReducer,
        status: statusReducer,
        auth: authReducer,
        financial: financialStore,
        facetexture: facetextureReducer,
        classification: classificationReducer,
    },
    devTools: process.env.NODE_ENV === "development",
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().prepend(LoadingMiddleware.middleware)
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppStore = typeof store;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

export type ThunkAppDispatch = ThunkDispatch<RootState, void, Action>;

export const useAppThunkDispatch = (): ThunkAppDispatch => useDispatch<ThunkAppDispatch>();
