import { renderWithProviders } from "@/util/test-utils";
import LoginHeader from "@/components/loginHeader/Index";

jest.mock("@/components/themeProvider/themeContext", () => ({
    useTheme: () => ({ state: { theme: "light" } }),
}));

// Prevent module-level apiAuth.get("/csrf/") from creating unhandled rejections
jest.mock("@/services/auth", () => ({
    refreshTokenAsync: jest.fn(),
    refreshTokenService: jest.fn(),
    signupService: jest.fn(),
}));

// ThemeControl uses useTheme — it's mocked via themeContext above
const mockUser = {
    id: 1,
    name: "Test User",
    username: "testuser",
    first_name: "Test",
    last_name: "User",
    email: "test@test.com",
    is_staff: false,
    is_active: true,
    is_superuser: false,
    last_login: "",
    date_joined: "",
};

describe("Test Characters container", () => {
    test("Check render", () => {
        const { baseElement } = renderWithProviders(
            <LoginHeader user={mockUser} status="unauthenticated" handleSignout={jest.fn()} />,
        );
        expect(baseElement).toBeInTheDocument();
    });

    test("renders avatar when authenticated", () => {
        const { getByRole } = renderWithProviders(
            <LoginHeader user={mockUser} status="authenticated" handleSignout={jest.fn()} />,
        );
        expect(getByRole("img")).toBeInTheDocument();
    });
});
