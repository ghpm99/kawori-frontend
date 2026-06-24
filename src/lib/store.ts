import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import authReducer from "./features/auth";
import classificationReducer from "./features/classification";
import facetextureReducer from "./features/facetexture";
import loadingReducer, { LoadingMiddleware } from "./features/loading";
import configurationReducer from "./features/configuration";
import statusReducer from "./features/status/Index";
import newsFeedReducer from "./features/news";

export const store = () =>
    configureStore({
        reducer: {
            loading: loadingReducer,
            configuration: configurationReducer,
            status: statusReducer,
            auth: authReducer,
            facetexture: facetextureReducer,
            classification: classificationReducer,
            news: newsFeedReducer,
        },
        devTools: process.env.NODE_ENV === "development",
        middleware: (getDefaultMiddleware) => {
            return getDefaultMiddleware().prepend(LoadingMiddleware.middleware);
        },
    });
export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, RootState, unknown, Action>;
