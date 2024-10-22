import { render, screen } from "@testing-library/react";
import FAQ from "./index";

describe("FAQ Component", () => {
    test("renders the FAQ component with correct items", () => {
        render(<FAQ />);

        // Check if all FAQ items are rendered
        expect(screen.getByText("Como eu utilizo o site?")).toBeInTheDocument();
        expect(screen.getByText("Quanto custa para utilizar o site?")).toBeInTheDocument();
        expect(screen.getByText("Utilizar o site é seguro?")).toBeInTheDocument();
        expect(screen.getByText("Como faço para entrar em contato com o suporte?")).toBeInTheDocument();
    });

    test("renders the correct content for each FAQ item", () => {
        render(<FAQ />);

        // Check the content of each FAQ item
        expect(
            screen.getByText(
                "Para utilizar o site, você deve se cadastrar e fazer o login. Após fazer o login, você terá acesso a todas as funcionalidades do site.",
            ),
        ).toBeInTheDocument();
        expect(
            screen.getByText("O site é gratuito para todos os usuários. Não cobramos nenhuma taxa de utilização."),
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "Sim, o site é seguro. Utilizamos as melhores práticas de segurança para proteger os dados dos nossos usuários. Além disso, não compartilhamos informações pessoais com terceiros.",
            ),
        ).toBeInTheDocument();
        expect(
            screen.getByText("Para entrar em contato com o suporte, entre no nosso grupo do discord atraves do link:"),
        ).toBeInTheDocument();
        expect(screen.getByText("Kawori Site")).toBeInTheDocument();
    });
});
