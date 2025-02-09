"use client";
import AuthProvider from "@/components/provider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "../../styles/globals.scss";
import StoreProvider from "./storeProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ConfigProvider, theme } from "antd";
import { antdThemes } from "@/styles/theme";
import locale from "antd/lib/locale/pt_BR";
import { useAppSelector } from "@/lib/hooks";

const { defaultAlgorithm, darkAlgorithm } = theme;

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const theme = useAppSelector((state) => state.configuration.theme);
    return (
        <ConfigProvider
            locale={locale}
            theme={{
                algorithm: theme === "dark" ? darkAlgorithm : defaultAlgorithm,
                ...antdThemes[theme],
            }}
        >
            {children}
        </ConfigProvider>
    );
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-br">
            <body>
                <StoreProvider>
                    <ThemeProvider>
                        <AntdRegistry>
                            <AuthProvider>
                                {children}
                                <Analytics />
                                <SpeedInsights />
                            </AuthProvider>
                        </AntdRegistry>
                    </ThemeProvider>
                </StoreProvider>
            </body>
        </html>
    );
}
