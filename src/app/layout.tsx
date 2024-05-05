import AuthProvider from "@/components/provider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import StoreProvider from "./storeProvider";

export const metadata = {
    title: "Kawori",
    description: "Facetexture e ranking de classe",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-br">
            <body>
                <StoreProvider>
                    <AuthProvider>
                        <AntdRegistry>{children}</AntdRegistry>
                    </AuthProvider>
                </StoreProvider>
            </body>
        </html>
    );
}
