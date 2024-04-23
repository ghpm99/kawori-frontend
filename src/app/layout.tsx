import { AntdRegistry } from "@ant-design/nextjs-registry";

export const metadata = {
    title: "Kawori",
    description: "Facetexture e ranking de classe",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-br">
            <body>
                <AntdRegistry>{children}</AntdRegistry>
            </body>
        </html>
    );
}
