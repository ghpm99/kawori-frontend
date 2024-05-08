import SingupForm from "@/components/signup/index";
import { signupControlledRequest } from "@/services/auth";
import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Router from "next/router";

jest.mock("next/router", () => ({
    push: jest.fn(),
}));

jest.mock("@/services/auth", () => ({
    signupService: jest.fn(),
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

beforeAll(() => {
    cleanup();
});

afterEach(() => {
    jest.clearAllMocks();
    cleanup();
});

describe("SingupForm", () => {
    it("should call signupService and signIn when form submission is successful", async () => {
        (signupControlledRequest.dispatchRequest as jest.Mock).mockResolvedValue({
            data: { msg: "Usuário criado com sucesso" },
        });

        const { getByLabelText, getByText } = render(<SingupForm />);
        const nameInput = getByLabelText("Nome");
        const lastNameInput = getByLabelText("Sobrenome");
        const usernameInput = getByLabelText("Usuario");
        const emailInput = getByLabelText("E-mail");
        const passwordInput = getByLabelText("Senha");
        const passwordConfirmationInput = getByLabelText("Confirme senha");
        const signupButton = getByText("Cadastrar");

        act(() => {
            fireEvent.change(nameInput, { target: { value: "test" } });
            fireEvent.change(lastNameInput, { target: { value: "test" } });
            fireEvent.change(usernameInput, { target: { value: "test" } });
            fireEvent.change(emailInput, { target: { value: "test@teste.com" } });
            fireEvent.change(passwordInput, { target: { value: "test@123" } });
            fireEvent.change(passwordConfirmationInput, { target: { value: "test@123" } });
            userEvent.click(signupButton);
        });

        await waitFor(() => {
            expect(signupControlledRequest).toHaveBeenCalledWith({
                name: "test",
                last_name: "test",
                username: "test",
                email: "test@teste.com",
                password: "test@123",
                confirm: "test@123",
            });

            expect(Router.push).toHaveBeenCalledWith("/admin/user");
        });
    });

    it("should show an error message when signupService fails", async () => {
        (signupControlledRequest.dispatchRequest as jest.Mock).mockRejectedValue({
            response: { status: 400, data: { msg: "Falhou em criar usuário" } },
        });

        const { getByLabelText, getByText } = render(<SingupForm />);
        const nameInput = getByLabelText("Nome");
        const lastNameInput = getByLabelText("Sobrenome");
        const usernameInput = getByLabelText("Usuario");
        const emailInput = getByLabelText("E-mail");
        const passwordInput = getByLabelText("Senha");
        const passwordConfirmationInput = getByLabelText("Confirme senha");
        const signupButton = getByText("Cadastrar");

        act(() => {
            fireEvent.change(nameInput, { target: { value: "test" } });
            fireEvent.change(lastNameInput, { target: { value: "test" } });
            fireEvent.change(usernameInput, { target: { value: "test" } });
            fireEvent.change(emailInput, { target: { value: "test@teste.com" } });
            fireEvent.change(passwordInput, { target: { value: "test@123" } });
            fireEvent.change(passwordConfirmationInput, { target: { value: "test@123" } });
            userEvent.click(signupButton);
        });

        await waitFor(() => {
            const errorMessage = getByText("Falhou em criar usuário");
            expect(errorMessage).toBeInTheDocument();
        });
    });
});
