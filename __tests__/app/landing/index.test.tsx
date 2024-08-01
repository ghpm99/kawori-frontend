import useMenuHeader from "@/components/menuHeader/useMenuHeader";

import { cleanup } from "@testing-library/react";
import { renderWithProviders } from "@/util/test-utils";
import Home from "@/app/(landing)/page.tsx";

jest.mock("@/components/menuHeader/useMenuHeader");
jest.mock("@/components/landing/news");
jest.mock("@prismicio");

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
        const { getByText } = renderWithProviders(<Home />);
        const title = getByText("Você está a apenas um passo de um novo nivel de personalização do seu jogo!");
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
