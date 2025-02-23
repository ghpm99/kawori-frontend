"use client";
import { antdThemes, Theme } from "@/styles/theme";
import { getSavedTheme } from "@/util";
import { ConfigProvider, theme } from "antd";
import locale from "antd/lib/locale/pt_BR";
import React, { useEffect, useReducer } from "react";
import { ThemeProvider as CustomThemeProvider } from "./themeContext";

const { defaultAlgorithm, darkAlgorithm } = theme;

type Status = "loading" | "idle";

type InitialStateType = {
    theme: Theme;
    status: Status;
};

const initialState: InitialStateType = {
    theme: "light",
    status: "loading",
};

const reducer = (state, action) => {
    switch (action.type) {
        case "CHANGE_THEME":
            return {
                ...state,
                theme: action.payload,
            };
        case "SET_STATUS":
            return {
                ...state,
                status: action.payload,
            };
        default:
            return state;
    }
};

const init = (initialState) => {
    const savedTheme = getSavedTheme();
    return {
        ...initialState,
        theme: savedTheme || initialState.theme,
    };
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, localDispatch] = useReducer(reducer, initialState, init);

    console.log("ThemeProvider", state);

    useEffect(() => {
        if (state.status !== "idle") return;
        localStorage.setItem("theme", state.theme);
        document.documentElement.className = state.theme;
    }, [state.theme, state.status]);

    useEffect(() => {
        localDispatch({ type: "SET_STATUS", payload: "idle" });
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
                {state.status === "idle" && children}
            </ConfigProvider>
        </CustomThemeProvider>
    );
};

export default ThemeProvider;
