import SingupForm from "@/components/signup/index";
import { signupService } from "@/services/auth";

import { renderWithProviders } from "@/util/test-utils";

import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Router from "next/router";
import axios from "axios";
import { useRouter } from "next/navigation";

jest.mock("axios");

jest.mock("next/navigation");

jest.mock("@sentry/nextjs", () => ({
    captureMessage: jest.fn(),
    captureException: jest.fn(),
}));

jest.mock("@/services/auth")


beforeAll(() => {
    cleanup();
});

afterEach(() => {
    jest.clearAllMocks();
    cleanup();
});

describe("SignupForm", () => {
    test("should call signupService and signIn when form submission is successful", async () => {
        const push = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push });

        let signupData: any = null;
        let signinData: any = null;

        (axios.post as jest.Mock).mockImplementation((url, data) => {
            console.log("mock", url, data);
            if (url === "/signup") {
                signupData = data;
                return Promise.resolve({
                    data: { msg: "Usuário criado com sucesso" },
                });
            } else if (url === "/token/") {
                signinData = data;
                return Promise.resolve({
                    data: { tokens: { access: "access_token", refresh: "refresh_token" } },
                });
            } else {
                return Promise.reject(new Error("URL não suportada"));
            }
        });

        renderWithProviders(<SingupForm />);
        const nameInput = screen.getByLabelText("Nome");
        const lastNameInput = screen.getByLabelText("Sobrenome");
        const usernameInput = screen.getByLabelText("Usuario");
        const emailInput = screen.getByLabelText("E-mail");
        const passwordInput = screen.getByLabelText("Senha");
        const passwordConfirmationInput = screen.getByLabelText("Confirme senha");
        const signupButton = screen.getByText("Cadastrar");

        fireEvent.change(nameInput, { target: { value: "test" } });
        fireEvent.change(lastNameInput, { target: { value: "test" } });
        fireEvent.change(usernameInput, { target: { value: "test" } });
        fireEvent.change(emailInput, { target: { value: "test@teste.com" } });
        fireEvent.change(passwordInput, { target: { value: "test@123" } });
        fireEvent.change(passwordConfirmationInput, { target: { value: "test@123" } });
        userEvent.click(signupButton);

        await waitFor(() => {
            expect(signupData).toStrictEqual({
                name: "test",
                last_name: "test",
                username: "test",
                email: "test@teste.com",
                password: "test@123",
                confirm: "test@123",
            });

            expect(signinData).toStrictEqual({ username: 'test', password: 'test@123', remember: true });
        });

        await waitFor(() => {
            expect(push).toHaveBeenCalledWith("/internal/user");
        });
    });

    test("should show an error message when signupService fails", async () => {
        (signupService as jest.Mock).mockRejectedValue({
            response: { status: 400, data: { msg: "Falhou em criar usuário" } },
        });

        renderWithProviders(<SingupForm />);
        const nameInput = screen.getByLabelText("Nome");
        const lastNameInput = screen.getByLabelText("Sobrenome");
        const usernameInput = screen.getByLabelText("Usuario");
        const emailInput = screen.getByLabelText("E-mail");
        const passwordInput = screen.getByLabelText("Senha");
        const passwordConfirmationInput = screen.getByLabelText("Confirme senha");
        const signupButton = screen.getByText("Cadastrar");

        fireEvent.change(nameInput, { target: { value: "test" } });
        fireEvent.change(lastNameInput, { target: { value: "test" } });
        fireEvent.change(usernameInput, { target: { value: "test" } });
        fireEvent.change(emailInput, { target: { value: "test@teste.com" } });
        fireEvent.change(passwordInput, { target: { value: "test@123" } });
        fireEvent.change(passwordConfirmationInput, { target: { value: "test@123" } });
        userEvent.click(signupButton);

        await waitFor(() => {
            const errorMessage = screen.getByText("Falhou em criar usuário");
            expect(errorMessage).toBeInTheDocument();
        });
    });
});
