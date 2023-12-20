import LoginPage from "@/pages/signin/index";
import { fireEvent, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";
import Router from "next/router";

jest.mock("next-auth/react", () => {
    const originalModule = jest.requireActual("next-auth/react");
    const mockSession = {
        expires: new Date(Date.now() + 2 * 86400).toISOString(),
        user: { name: "Teste123" },
    };
    return {
        ...originalModule,
        useSession: jest.fn(() => {
            return { data: mockSession, status: "authenticated" };
        }),
        signIn: jest.fn(),
    };
});

jest.mock("next/router", () => ({
    push: jest.fn(),
}));

jest.mock("@/services/auth", () => ({
    signinService: jest.fn(() => Promise.resolve({ status: 200 })),
}));

Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

describe("LoginPage", () => {
    it("should render the login form", () => {
        const { getByLabelText, getByText } = render(<LoginPage />);

        expect(getByLabelText("Usuario")).toBeInTheDocument();
        expect(getByLabelText("Senha")).toBeInTheDocument();
        expect(getByText("Logar")).toBeInTheDocument();
    });

    it("should show an error message when login fails", async () => {
        (signIn as jest.Mock).mockImplementation(() => Promise.resolve({ status: 400 }));

        const { getByLabelText, getByText } = render(<LoginPage />);
        const usernameInput = getByLabelText("Usuario");
        const passwordInput = getByLabelText("Senha");
        const loginButton = getByText("Logar");

        fireEvent.change(usernameInput, { target: { value: "test" } });
        fireEvent.change(passwordInput, { target: { value: "test" } });
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(getByText("Usuario ou senha incorretos")).toBeInTheDocument();
        });
    });

    it("should redirect to /admin/user when login is successful", async () => {
        (signIn as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                status: 200,
                data: {
                    token: "",
                },
            }),
        );

        const { getByLabelText, getByText } = render(<LoginPage />);
        const usernameInput = getByLabelText("Usuario");
        const passwordInput = getByLabelText("Senha");
        const loginButton = getByText("Logar");

        fireEvent.change(usernameInput, { target: { value: "test" } });
        fireEvent.change(passwordInput, { target: { value: "test" } });
        userEvent.click(loginButton);

        await waitFor(() => {
            expect(Router.push).toHaveBeenCalledWith("/admin/user");
        });
    });
});
