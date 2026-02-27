import LandingLayout from "@/app/(landing)/layout.tsx";
import Home from "@/app/(landing)/page.tsx";
import { renderWithProviders } from "@/util/test-utils";
import { cleanup, screen } from "@testing-library/react";

jest.mock("@/components/themeProvider/themeContext", () => ({
    useTheme: () => ({ state: { theme: "light" } }),
}));

// Prevent module-level apiAuth.get("/csrf/") from creating unhandled rejections
jest.mock("@/services/auth", () => ({
    refreshTokenAsync: jest.fn(),
    refreshTokenService: jest.fn(),
    signupService: jest.fn(),
}));

jest.mock("@sentry/nextjs", () => ({
    captureException: jest.fn(),
    init: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// Mock signup/signin since they use antd Form internals
jest.mock("@/components/signup", () => ({
    __esModule: true,
    default: ({ onFinish, onFinishFailed }: any) => (
        <form data-testid="signup-form" onSubmit={onFinish}>
            <input aria-label="Nome" data-testid="form-name" />
            <input aria-label="Sobrenome" data-testid="form-last-name" />
            <input aria-label="Usuario" data-testid="form-username" />
            <input aria-label="E-mail" data-testid="form-email" type="email" />
            <input aria-label="Senha" data-testid="form-password" type="password" />
            <input aria-label="Confirme senha" data-testid="form-confirm" type="password" />
            <button type="submit">Cadastrar</button>
        </form>
    ),
}));

jest.mock("@/components/signin", () => ({
    __esModule: true,
    default: ({ onFinish }: any) => (
        <form onSubmit={onFinish}>
            <input aria-label="Usuario" />
            <input aria-label="Senha" type="password" />
            <button type="submit">Logar</button>
        </form>
    ),
}));

jest.mock("@/components/landing/userPanel", () => ({ loginPage, signupPage }: any) => (
    <div>
        <div data-testid="cadastro-form">Cadastro</div>
        <input aria-label="Nome" />
        <input aria-label="Sobrenome" />
        <input aria-label="Usuario" />
        <input aria-label="E-mail" type="email" />
        <input aria-label="Senha" type="password" />
        <input aria-label="Confirme senha" type="password" />
    </div>
));

jest.mock("@/components/landing/FAQ", () => () => <div>FAQ</div>);
jest.mock("@/components/landing/facetexture", () => ({ theme }: any) => (
    <div>
        <h2>O cadastro é gratuito, simples e rapido.</h2>
    </div>
));
jest.mock("@/components/landing/welcome", () => () => (
    <div>
        <h2>Kawori é uma plataforma de personalização de tela de seleção de personagens para Black Desert Online.</h2>
    </div>
));

jest.mock("@/components/landing/news", () => () => <div>News</div>);
jest.mock("@/prismicio");
jest.mock("@/app/api/lib/news", () => ({
    fetchNewsFeedData: jest.fn().mockResolvedValue([]),
    fetchProjectDetailData: jest.fn().mockResolvedValue([]),
}));

jest.mock("next/image", () => ({
    __esModule: true,
    default: ({ alt }: any) => <img alt={alt} />,
}));

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
        renderWithProviders(<Home />);
        const title = screen.getByRole("heading", {
            name: /kawori é uma plataforma de personalização de tela de seleção de personagens para black desert online\./i,
        });
        expect(title).toBeInTheDocument();
    });

    test("should render the signup text correctly", () => {
        const { getByText } = renderWithProviders(<Home />);
        const signupText = getByText("O cadastro é gratuito, simples e rapido.");
        expect(signupText).toBeInTheDocument();
    });

    test("should render the form title correctly", () => {
        renderWithProviders(<Home />);
        const formTitle = screen.getByTestId(/cadastro-form/i);
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
        renderWithProviders(
            <LandingLayout>
                <div>Teste</div>
            </LandingLayout>,
        );
        const footerText = screen.getByText(/Sinta-se a vontade para entrar para/i);
        expect(footerText).toBeInTheDocument();
    });

    test("should render the discord link correctly", () => {
        renderWithProviders(
            <LandingLayout>
                <div>Teste</div>
            </LandingLayout>,
        );
        const discordLink = screen.getByText("nossa comunidade");
        expect(discordLink).toBeInTheDocument();
        expect(discordLink).toHaveAttribute("href", "https://discord.gg/fykNkXyn2r");
    });
});
