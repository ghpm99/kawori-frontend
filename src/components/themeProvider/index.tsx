"use client";
import { changeTheme } from "@/lib/features/configuration";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { antdThemes } from "@/styles/theme";
import { getSavedTheme } from "@/util";
import { ConfigProvider, theme } from "antd";
import locale from "antd/lib/locale/pt_BR";
import { useEffect } from "react";

const { defaultAlgorithm, darkAlgorithm } = theme;

const savedTheme = getSavedTheme();

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.configuration.theme);

    useEffect(() => {
        console.log("theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        console.log("savedTheme", savedTheme);
        dispatch(changeTheme(savedTheme));
    }, []);

    return (
        <ConfigProvider
            locale={locale}
            theme={{
                algorithm: theme === "dark" ? darkAlgorithm : defaultAlgorithm,
                ...antdThemes[theme],
            }}
        >
            <div style={{ colorScheme: theme === "dark" ? "dark" : "light" }}>{children}</div>
        </ConfigProvider>
    );
};

export default ThemeProvider;
