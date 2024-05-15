import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import useMenu from "@/components/menuInternal/useMenu";
import MenuInternal from "@/components/menuInternal/Index";

jest.mock("@/components/menuAdmin/useMenu");

describe("Test Characters container", () => {
    it("renders correctly for unauthenticated users", () => {
        (useMenu as jest.Mock).mockReturnValue({
            status: "",
            collapsed: false,
            toggleCollapsed: jest.fn(),
        });

        const { getByText, queryByText } = render(<MenuInternal />);

        expect(getByText("Inicio")).toBeInTheDocument();
        expect(queryByText("Conta")).not.toBeInTheDocument();
        expect(queryByText("Facetexture")).not.toBeInTheDocument();

        expect(queryByText("Remoto")).not.toBeInTheDocument();
        expect(queryByText("Financeiro")).not.toBeInTheDocument();
        expect(queryByText("server")).not.toBeInTheDocument();

        expect(queryByText("Comando")).not.toBeInTheDocument();
        expect(queryByText("Remoto")).not.toBeInTheDocument();
        expect(queryByText("Status")).not.toBeInTheDocument();
        expect(queryByText("Overview")).not.toBeInTheDocument();
        expect(queryByText("Contratos")).not.toBeInTheDocument();
        expect(queryByText("Notas")).not.toBeInTheDocument();
        expect(queryByText("Pagamentos")).not.toBeInTheDocument();
        expect(queryByText("Tags")).not.toBeInTheDocument();
        expect(queryByText("Servidor")).not.toBeInTheDocument();
    });

    it("renders correctly for authenticated normal users", () => {
        (useMenu as jest.Mock).mockReturnValue({
            status: "authenticated",
            collapsed: false,
            toggleCollapsed: jest.fn(),
            data: { user: { isSuperuser: false } },
        });

        const { getByText, queryByText } = render(<MenuInternal />);

        expect(getByText("Inicio")).toBeInTheDocument();

        expect(getByText("Conta")).toBeInTheDocument();
        expect(getByText("Facetexture")).toBeInTheDocument();

        expect(queryByText("Remoto")).not.toBeInTheDocument();
        expect(queryByText("Financeiro")).not.toBeInTheDocument();
        expect(queryByText("Servidor")).not.toBeInTheDocument();

        expect(queryByText("Comando")).not.toBeInTheDocument();
        expect(queryByText("Remoto")).not.toBeInTheDocument();
        expect(queryByText("Status")).not.toBeInTheDocument();
        expect(queryByText("Overview")).not.toBeInTheDocument();
        expect(queryByText("Contratos")).not.toBeInTheDocument();
        expect(queryByText("Notas")).not.toBeInTheDocument();
        expect(queryByText("Pagamentos")).not.toBeInTheDocument();
        expect(queryByText("Tags")).not.toBeInTheDocument();
        expect(queryByText("Servidor")).not.toBeInTheDocument();
    });

    it("renders correctly for authenticated super users", () => {
        (useMenu as jest.Mock).mockReturnValue({
            status: "authenticated",
            collapsed: false,
            toggleCollapsed: jest.fn(),
            data: { user: { isSuperuser: true } },
        });

        const { getByText, queryByText } = render(<MenuInternal />);

        expect(getByText("Inicio")).toBeInTheDocument();

        expect(getByText("Conta")).toBeInTheDocument();
        expect(getByText("Facetexture")).toBeInTheDocument();

        expect(getByText("Remoto")).toBeInTheDocument();
        expect(getByText("Financeiro")).toBeInTheDocument();
        expect(getByText("Servidor")).toBeInTheDocument();
    });
});
