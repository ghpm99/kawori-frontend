import useMenuHeader from "@/components/menuHeader/useMenuHeader";

import { cleanup, screen } from "@testing-library/react";
import { renderWithProviders } from "@/util/test-utils";
import Home from "@/app/(landing)/page.tsx";

import { cache } from "react";

jest.mock("@/components/menuHeader/useMenuHeader");
jest.mock("@/components/landing/news");
jest.mock("@/prismicio");
jest.mock("react", () => ({
    ...jest.requireActual("react"),
    cache: jest.fn(),
}));

beforeAll(() => {
    cleanup();
});

afterEach(() => {
    jest.clearAllMocks();
    cleanup();
});

describe("Home Page", () => {
    test("should render the page", () => {
        const { container } = renderWithProviders(<Home />);
        expect(container).toBeDefined();
    });

    test("should render the title correctly", () => {
        (useMenuHeader as jest.Mock).mockReturnValue({
            status: "authenticated",
            data: {
                user: {
                    image: "test-image",
                    name: "test-name",
                    email: "test-email",
                },
            },
        });
        renderWithProviders(<Home />);
        const title = screen.getByRole('heading', { name: /kawori é uma plataforma de personalização de tela de seleção de personagens para black desert online\./i })
        expect(title).toBeInTheDocument();
    });

    test("should render the signup text correctly", () => {
        const { getByText } = renderWithProviders(<Home />);
        const signupText = getByText("O cadastro é gratuito, simples e rapido.");
        expect(signupText).toBeInTheDocument();
    });

    test("should render the form title correctly", () => {
        const { getByText } = renderWithProviders(<Home />);
        const formTitle = getByText("Cadastro");
        expect(formTitle).toBeInTheDocument();
    });

    test("should render the SingupForm component", () => {
        const { getByLabelText } = renderWithProviders(<Home />);
        const nameInput = getByLabelText("Nome");
        const lastNameInput = getByLabelText("Sobrenome");
        const usernameInput = getByLabelText("Usuario");
        const emailInput = getByLabelText("E-mail");
        const passwordInput = getByLabelText("Senha");
        const passwordConfirmationInput = getByLabelText("Confirme senha");
        expect(nameInput).toBeInTheDocument();
        expect(lastNameInput).toBeInTheDocument();
        expect(usernameInput).toBeInTheDocument();
        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(passwordConfirmationInput).toBeInTheDocument();
    });

    test("should render the footer text correctly", () => {
        const { getByText } = renderWithProviders(<Home />);
        const footerText = getByText(/Sinta-se a vontade para entrar para/i);
        expect(footerText).toBeInTheDocument();
    });

    test("should render the discord link correctly", () => {
        const { getByText } = renderWithProviders(<Home />);
        const discordLink = getByText("nossa comunidade");
        expect(discordLink).toBeInTheDocument();
        expect(discordLink).toHaveAttribute("href", "https://discord.gg/fykNkXyn2r");
    });
});
