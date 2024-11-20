"use client";
import AuthProvider from "@/components/provider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "../../styles/globals.scss";
import StoreProvider from "./storeProvider";
import { Analytics } from "@vercel/analytics/react"

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-br">
            <body>
                <StoreProvider>
                    <AntdRegistry>
                        <AuthProvider>
                            {children}
                            <Analytics />
                        </AuthProvider>
                    </AntdRegistry>
                </StoreProvider>
            </body>
        </html>
    );
}
