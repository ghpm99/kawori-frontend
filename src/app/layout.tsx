"use client";
import "../../styles/globals.scss";
import AuthProvider from "@/components/provider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import StoreProvider from "./storeProvider";
import Head from "next/head";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-br">
            <body>
                <StoreProvider>
                    <AntdRegistry>
                        <AuthProvider>{children}</AuthProvider>
                    </AntdRegistry>
                </StoreProvider>
            </body>
        </html>
    );
}
