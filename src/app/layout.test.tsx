import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";

jest.mock("next/navigation");

// ESM-only packages not processed by ts-jest — mock them out
jest.mock("@vercel/analytics/react", () => ({ Analytics: () => null }));
jest.mock("@vercel/speed-insights/next", () => ({ SpeedInsights: () => null }));

// Mock providers to render children transparently
jest.mock("@/components/authProvider", () => ({ children }: any) => <>{children}</>);
jest.mock("@/components/themeProvider", () => ({ children }: any) => <>{children}</>);
jest.mock("@/app/storeProvider", () => ({ children }: any) => <>{children}</>);
jest.mock("@ant-design/nextjs-registry", () => ({ AntdRegistry: ({ children }: any) => <>{children}</> }));

// Prevent module-level apiAuth.get("/csrf/") from creating unhandled rejections
jest.mock("@/services/auth", () => ({
    refreshTokenAsync: jest.fn(),
    refreshTokenService: jest.fn(),
    signupService: jest.fn(),
}));

describe("RootLayout", () => {
    test("should render the layout", () => {
        render(
            <RootLayout>
                <div>Teste</div>
            </RootLayout>,
        );
        expect(screen.getByText("Teste")).toBeInTheDocument();
    });

    test("should render children elements", () => {
        render(
            <RootLayout>
                <div>Child Element</div>
            </RootLayout>,
        );
        expect(screen.getByText("Child Element")).toBeInTheDocument();
    });

    test("should render multiple children elements", () => {
        render(
            <RootLayout>
                <div>First Child</div>
                <div>Second Child</div>
            </RootLayout>,
        );
        expect(screen.getByText("First Child")).toBeInTheDocument();
        expect(screen.getByText("Second Child")).toBeInTheDocument();
    });

    test("should render without children", () => {
        render(<RootLayout />);
        expect(screen.queryByText("Teste")).not.toBeInTheDocument();
    });
});
