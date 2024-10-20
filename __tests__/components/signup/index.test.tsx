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

beforeAll(() => {
    cleanup();
});

afterEach(() => {
    jest.clearAllMocks();
    cleanup();
});

describe("SignupForm", () => {
    test("should render SignupForm correctly", () => {
        renderWithProviders(<SingupForm />);
        const nameInput = screen.getByTestId("form-name");
        const lastNameInput = screen.getByTestId("form-last-name");
        const usernameInput = screen.getByTestId("form-username");
        const emailInput = screen.getByTestId("form-email");
        const passwordInput = screen.getByTestId("form-password");
        const passwordConfirmationInput = screen.getByTestId("form-confirm");
        const signupButton = screen.getByText("Cadastrar");

        expect(nameInput).toBeInTheDocument();
        expect(lastNameInput).toBeInTheDocument();
        expect(usernameInput).toBeInTheDocument();
        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(passwordConfirmationInput).toBeInTheDocument();
        expect(signupButton).toBeInTheDocument();
    });
    test("should show an error message when form submission is invalid", async () => {
        renderWithProviders(<SingupForm />);
        const signupButton = screen.getByText("Cadastrar");
        userEvent.click(signupButton);

        const nameErrorMessage = await screen.findByText("Por favor insira seu nome!");
        const lastNameErrorMessage = await screen.findByText("Por favor insira seu sobrenome!");
        const usernameErrorMessage = await screen.findByText("Por favor insira seu usuário!");
        const emailErrorMessage = await screen.findByText("Por favor insira seu e-mail!");
        const passwordErrorMessage = await screen.findByText("Por favor insira sua senha!");
        const passwordConfirmationErrorMessage = await screen.findByText("Por favor confirme sua senha!");

        expect(nameErrorMessage).toBeInTheDocument();
        expect(lastNameErrorMessage).toBeInTheDocument();
        expect(usernameErrorMessage).toBeInTheDocument();
        expect(emailErrorMessage).toBeInTheDocument();
        expect(passwordErrorMessage).toBeInTheDocument();
        expect(passwordConfirmationErrorMessage).toBeInTheDocument();
    });
    test("should show an error message when password and password confirmation do not match", async () => {
        renderWithProviders(<SingupForm />);

        const passwordInput = screen.getByTestId("form-password");
        const passwordConfirmationInput = screen.getByTestId("form-confirm");
        userEvent.type(passwordInput, "test@123");
        userEvent.type(passwordConfirmationInput, "test@1234");

        expect(await screen.findByText("As duas senhas que você digitou não correspondem!")).toBeInTheDocument();
    });
    test("should call signupService and signIn when form submission is successful", async () => {
        const push = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push });

        let signupData: any = null;
        let signinData: any = null;

        (axios.post as jest.Mock).mockImplementation((url, data) => {
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

            expect(signinData).toStrictEqual({ username: "test", password: "test@123", remember: true });
        });

        await waitFor(() => {
            expect(push).toHaveBeenCalledWith("/internal/user");
        });
    });

    test("should show an error message when signupService fails", async () => {
        (axios.post as jest.Mock).mockRejectedValue({
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
