"use client";
import AuthProvider from "@/components/provider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "../../styles/globals.scss";
import StoreProvider from "./storeProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-br">
            <body>
                <StoreProvider>
                    <AntdRegistry>
                        <AuthProvider>
                            {children}
                            <Analytics />
                            <SpeedInsights />
                        </AuthProvider>
                    </AntdRegistry>
                </StoreProvider>
            </body>
        </html>
    );
}
