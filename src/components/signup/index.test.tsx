import SingupForm from "@/components/signup/index";

import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// SingupForm is a pure presentational component — no Redux needed
const defaultProps = {
    loading: false,
    form: undefined as any,
    onFinish: jest.fn(),
    onFinishFailed: jest.fn(),
};

describe("SignupForm", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test("should render SignupForm correctly", () => {
        render(<SingupForm {...defaultProps} />);
        expect(screen.getByTestId("form-name")).toBeInTheDocument();
        expect(screen.getByTestId("form-last-name")).toBeInTheDocument();
        expect(screen.getByTestId("form-username")).toBeInTheDocument();
        expect(screen.getByTestId("form-email")).toBeInTheDocument();
        expect(screen.getByTestId("form-password")).toBeInTheDocument();
        expect(screen.getByTestId("form-confirm")).toBeInTheDocument();
        expect(screen.getByText("Cadastrar")).toBeInTheDocument();
    });
    describe("form validation", () => {
        test.skip("should show an error message when form submission is invalid", async () => {
            render(<SingupForm {...defaultProps} />);
            const signupButton = screen.getByText("Cadastrar");
            await userEvent.click(signupButton);

            expect(await screen.findByText("Por favor insira seu nome!")).toBeInTheDocument();
            expect(await screen.findByText("Por favor insira seu sobrenome!")).toBeInTheDocument();
            expect(await screen.findByText("Por favor insira seu usuário!")).toBeInTheDocument();
            expect(await screen.findByText("Por favor insira seu e-mail!")).toBeInTheDocument();
            expect(await screen.findByText("Por favor insira sua senha!")).toBeInTheDocument();
            expect(await screen.findByText("Por favor confirme sua senha!")).toBeInTheDocument();
        });
        test("should show an error message when name is more than 100 characters", async () => {
            render(<SingupForm {...defaultProps} />);
            const nameInput = screen.getByTestId("form-name");
            await userEvent.type(nameInput, "a".repeat(101));
            await waitFor(() => {
                expect(screen.getByText(/o nome deve ter no máximo 100 caracteres!/i)).toBeInTheDocument();
            });
        });
        test("should show an error message when last_name is more than 100 characters", async () => {
            render(<SingupForm {...defaultProps} />);
            const lastNameInput = screen.getByTestId("form-last-name");
            await userEvent.type(lastNameInput, "a".repeat(101));
            await waitFor(() => {
                expect(screen.getByText(/o sobrenome deve ter no máximo 100 caracteres!/i)).toBeInTheDocument();
            });
        });
        test("should show an error message when username is more than 100 characters", async () => {
            render(<SingupForm {...defaultProps} />);
            const usernameInput = screen.getByTestId("form-username");
            await userEvent.type(usernameInput, "a".repeat(101));
            await waitFor(() => {
                expect(screen.getByText(/o usuário deve ter no máximo 100 caracteres!/i)).toBeInTheDocument();
            });
        });
        test("should show an error message when email is invalid", async () => {
            render(<SingupForm {...defaultProps} />);
            const emailInput = screen.getByLabelText("E-mail");
            fireEvent.change(emailInput, { target: { value: "invalid-email" } });

            await userEvent.click(screen.getByText("Cadastrar"));

            await waitFor(() => {
                expect(screen.getByText("Por favor verifique seu e-mail")).toBeInTheDocument();
            });
        });
        test("should show an error message when password is less than 8 characters", async () => {
            render(<SingupForm {...defaultProps} />);
            const passwordInput = screen.getByTestId("form-password");
            await userEvent.type(passwordInput, "test");
            await waitFor(() => {
                expect(screen.getByText(/a senha deve ter no mínimo 8 caracteres!/i)).toBeInTheDocument();
            });
        });
        test("should show an error message when password and password confirmation do not match", async () => {
            render(<SingupForm {...defaultProps} />);
            const passwordInput = screen.getByTestId("form-password");
            const passwordConfirmationInput = screen.getByTestId("form-confirm");
            await userEvent.type(passwordInput, "test@123");
            await userEvent.type(passwordConfirmationInput, "test@1234");

            await waitFor(() => {
                expect(screen.getByText("As duas senhas que você digitou não correspondem!")).toBeInTheDocument();
            });
        });
    });
    test.skip("should call signupService and signIn when form submission is successful", async () => {
        render(<SingupForm {...defaultProps} />);

        await userEvent.type(screen.getByLabelText("Nome"), "test");
        await userEvent.type(screen.getByLabelText("Sobrenome"), "test");
        await userEvent.type(screen.getByLabelText("Usuario"), "test");
        await userEvent.type(screen.getByLabelText("E-mail"), "test@teste.com");
        await userEvent.type(screen.getByLabelText("Senha"), "test@123");
        await userEvent.type(screen.getByLabelText("Confirme senha"), "test@123");
        await userEvent.click(screen.getByText("Cadastrar"));

        await waitFor(() => {
            expect(defaultProps.onFinish).toHaveBeenCalled();
        });
    });

    test("should call onFinish with form values on valid submission", async () => {
        const onFinish = jest.fn();
        render(<SingupForm loading={false} form={undefined as any} onFinish={onFinish} onFinishFailed={jest.fn()} />);

        await userEvent.type(screen.getByTestId("form-name"), "Test");
        await userEvent.type(screen.getByTestId("form-last-name"), "User");
        await userEvent.type(screen.getByTestId("form-username"), "testuser");
        await userEvent.type(screen.getByLabelText("E-mail"), "test@test.com");
        await userEvent.type(screen.getByTestId("form-password"), "password123");
        await userEvent.type(screen.getByTestId("form-confirm"), "password123");

        await userEvent.click(screen.getByText("Cadastrar"));

        await waitFor(() => {
            expect(onFinish).toHaveBeenCalled();
        });
    });
});
