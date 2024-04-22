import { Action, ThunkDispatch, combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import commonReducer from "./features/common/Index";
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
        status: statusReducer,
        common: commonReducer,
        financial: financialStore,
        facetexture: facetextureReducer,
        classification: classificationReducer,
    },
    devTools: process.env.NODE_ENV === "development",
});

export type RootState = ReturnType<typeof store.getState>;

export type AppStore = typeof store;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

export type ThunkAppDispatch = ThunkDispatch<RootState, void, Action>;

export const useAppThunkDispatch = (): ThunkAppDispatch => useDispatch<ThunkAppDispatch>();
