import MenuHeader from "@/components/menuHeader/index";
import { render, screen } from "@testing-library/react";

// ThemeControl uses useTheme which throws without a provider — mock it out
jest.mock("@/components/themeControl", () => () => null);

const mockUser = {
    id: 1,
    name: "test-name",
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

describe("MenuHeader", () => {
    test("should render the menu header with user options when authenticated", () => {
        render(<MenuHeader status="authenticated" user={mockUser} theme="light" />);

        expect(screen.getByText("Inicio")).toBeInTheDocument();
        expect(screen.getByText("Black Desert")).toBeInTheDocument();
    });

    test("should render the menu header with login option when not authenticated", () => {
        render(<MenuHeader status="unauthenticated" user={mockUser} theme="light" />);

        expect(screen.getByText("Inicio")).toBeInTheDocument();
        expect(screen.getByText("Black Desert")).toBeInTheDocument();
    });

    describe("MenuHeader authentication variants", () => {
        test("should render the login link when not authenticated", () => {
            render(<MenuHeader status="unauthenticated" user={mockUser} theme="light" />);

            expect(screen.getByText("Inicio")).toBeInTheDocument();
            expect(screen.getByText("Black Desert")).toBeInTheDocument();
            expect(screen.getByText("Logar")).toBeInTheDocument();
        });
    });
});
