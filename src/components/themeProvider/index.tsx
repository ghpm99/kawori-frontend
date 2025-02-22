"use client";
import { changeTheme } from "@/lib/features/configuration";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { antdThemes } from "@/styles/theme";
import { getSavedTheme } from "@/util";
import { ConfigProvider, theme } from "antd";
import locale from "antd/lib/locale/pt_BR";
import React, { useEffect, useReducer } from "react";
import { ThemeProvider as CustomThemeProvider } from "./themeContext";
import State from "pusher-js/types/src/core/http/state";

const { defaultAlgorithm, darkAlgorithm } = theme;

enum Status {
    STARTUP = "startup",
    LOADING = "loading",
    LOADED = "loaded",
}

const initialState = {
    status: Status.STARTUP,
    theme: "light",
};

const reducer = (state, action) => {
    switch (action.type) {
        case "CHANGE_THEME":
            return {
                ...state,
                theme: action.payload,
            };
        case "LOADING":
            return {
                ...state,
                status: Status.LOADING,
            };
        case "LOADED":
            return {
                ...state,
                status: Status.LOADED,
            };
        default:
            return state;
    }
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, localDispatch] = useReducer(reducer, initialState);

    console.log("ThemeProvider", state);

    useEffect(() => {
        if (state.status !== Status.LOADED) return;
        console.log("theme", state.theme);
        localStorage.setItem("theme", state.theme);
        document.documentElement.className = state.theme;
    }, [state.theme, state.status]);

    useEffect(() => {
        localDispatch({ type: "LOADING" });

        const savedTheme = getSavedTheme();
        console.log("savedTheme", savedTheme);
        if (savedTheme) {
            localDispatch({ type: "CHANGE_THEME", payload: savedTheme });
        }

        localDispatch({ type: "LOADED" });
    }, []);

    return (
        <CustomThemeProvider value={{ state, dispatch: localDispatch }}>
            <ConfigProvider
                locale={locale}
                theme={{
                    algorithm: state.theme === "dark" ? darkAlgorithm : defaultAlgorithm,
                    ...antdThemes[state.theme],
                }}
            >
                {state.status === Status.LOADED && children}
            </ConfigProvider>
        </CustomThemeProvider>
    );
};

export default ThemeProvider;
