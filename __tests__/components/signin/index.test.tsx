import axios from "axios";
import LoginPage from "@/components/signin";
import { fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/util/test-utils";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn(),
    })),
}));

jest.mock("@sentry/nextjs", () => ({
    captureMessage: jest.fn(),
    captureException: jest.fn(),
}));

describe("LoginPage", () => {
    test("should render the login form", () => {
        const { getByLabelText, getByText } = renderWithProviders(<LoginPage />);

        expect(getByLabelText("Usuario")).toBeInTheDocument();
        expect(getByLabelText("Senha")).toBeInTheDocument();
        expect(getByText("Logar")).toBeInTheDocument();
    });

    test("should show an error message when login fails", async () => {
        const { getByLabelText, getByText } = renderWithProviders(<LoginPage />);
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

    test("should redirect to /admin/user when login is successful", async () => {
        const push = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push });

        axios.post.mockResolvedValue({ data: { tokens: { access: "", refresh: "" } } });

        const { getByLabelText, getByText } = renderWithProviders(<LoginPage />);
        const usernameInput = getByLabelText("Usuario");
        const passwordInput = getByLabelText("Senha");
        const loginButton = getByText("Logar");

        fireEvent.change(usernameInput, { target: { value: "test" } });
        fireEvent.change(passwordInput, { target: { value: "test" } });
        userEvent.click(loginButton);

        await waitFor(() => {
            expect(push).toHaveBeenCalledWith("/internal/user");
        });
    });
});
