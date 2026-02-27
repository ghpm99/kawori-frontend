import DashboardLayout from "@/app/admin/layout.tsx";
import { renderWithProviders } from "@/util/test-utils";

jest.mock("next/navigation");

jest.mock("@/components/themeProvider/themeContext", () => ({
    useTheme: () => ({ state: { theme: "light" } }),
}));

// Prevent module-level apiAuth.get("/csrf/") from creating unhandled rejections
jest.mock("@/services/auth", () => ({
    refreshTokenAsync: jest.fn(),
    refreshTokenService: jest.fn(),
    signupService: jest.fn(),
}));

describe("Admin layout", () => {
    test("Should be render the component", () => {
        const { container } = renderWithProviders(
            <DashboardLayout>
                <div>test</div>
            </DashboardLayout>,
        );
        expect(container).toBeDefined();
    });
});
