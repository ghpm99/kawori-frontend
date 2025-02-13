"use client";
import AuthProvider from "@/components/provider";
import ThemeProvider from "@/components/themeProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../../styles/globals.scss";
import StoreProvider from "./storeProvider";

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
