import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import MenuInternal from "@/components/menuInternal/Index";

// Mock antd icons to avoid loading the heavy icon package
jest.mock("@ant-design/icons", () => ({
    AppstoreOutlined: () => null,
    HomeOutlined: () => null,
    SettingOutlined: () => null,
    SnippetsOutlined: () => null,
    UserOutlined: () => null,
}));

// Lightweight antd mock — renders menu item labels so text assertions work
jest.mock("antd", () => ({
    Layout: {
        Sider: ({ children }: any) => <div>{children}</div>,
    },
    Menu: ({ items }: any) => (
        <nav>
            {items?.map((item: any) => (
                <div key={item.key}>
                    {item.label}
                    {item.children?.map((child: any) => (
                        <div key={child.key}>{child.label}</div>
                    ))}
                </div>
            ))}
        </nav>
    ),
}));

const defaultProps = {
    status: "unauthenticated" as const,
    theme: "light" as const,
    selectedMenu: [] as any[],
    groups: [] as string[],
};

describe("Test Characters container", () => {
    test("renders correctly for unauthenticated users", () => {
        render(<MenuInternal {...defaultProps} />);

        expect(screen.getByText("Inicio")).toBeInTheDocument();
        expect(screen.queryByText("Conta")).not.toBeInTheDocument();
        expect(screen.queryByText("Facetexture")).not.toBeInTheDocument();

        expect(screen.queryByText("Financeiro")).not.toBeInTheDocument();
        expect(screen.queryByText("Servidor")).not.toBeInTheDocument();
    });

    test("renders correctly for authenticated normal users", () => {
        render(<MenuInternal {...defaultProps} status="authenticated" groups={["user", "blackdesert"]} />);

        expect(screen.getByText("Inicio")).toBeInTheDocument();
        expect(screen.getByText("Conta")).toBeInTheDocument();
        expect(screen.getByText("Facetexture")).toBeInTheDocument();

        expect(screen.queryByText("Financeiro")).not.toBeInTheDocument();
        expect(screen.queryByText("Servidor")).not.toBeInTheDocument();
    });

    test("renders correctly for authenticated super users", () => {
        render(
            <MenuInternal
                {...defaultProps}
                status="authenticated"
                groups={["user", "blackdesert", "financial", "admin"]}
            />,
        );

        expect(screen.getByText("Inicio")).toBeInTheDocument();
        expect(screen.getByText("Conta")).toBeInTheDocument();
        expect(screen.getByText("Facetexture")).toBeInTheDocument();
        expect(screen.getByText("Financeiro")).toBeInTheDocument();
        expect(screen.getByText("Servidor")).toBeInTheDocument();
    });
});
