import { renderWithProviders } from "@/util/test-utils";
import "@testing-library/jest-dom";
import { useSession } from "next-auth/react";
import MenuAdmin from "./Index";
import { act, fireEvent, waitFor } from "@testing-library/react";

jest.mock("next-auth/react", () => {
    const originalModule = jest.requireActual("next-auth/react");

    return {
        __esModule: true,
        ...originalModule,
        useSession: jest.fn(),
    };
});

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

describe("Test Characters container", () => {
    it("Check render not authenticated", () => {
        const session = {
            expires: new Date(Date.now() + 2 * 86400).toISOString(),
            user: { name: "Teste123" },
        };
        (useSession as jest.Mock).mockReturnValue({ data: session, status: "" });
        const { baseElement, getByText, queryByText } = renderWithProviders(<MenuAdmin selected={["home"]} />);
        expect(baseElement).toBeInTheDocument();

        expect(getByText("Kawori")).toBeInTheDocument();
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
    it("Check render normal user authenticated", () => {
        const session = {
            expires: new Date(Date.now() + 2 * 86400).toISOString(),
            user: { name: "Teste123" },
        };
        (useSession as jest.Mock).mockReturnValue({ data: session, status: "authenticated" });
        const { baseElement, getByText, queryByText } = renderWithProviders(<MenuAdmin selected={["home"]} />);
        expect(baseElement).toBeInTheDocument();

        expect(getByText("Kawori")).toBeInTheDocument();
        expect(getByText("Inicio")).toBeInTheDocument();

        expect(queryByText("Conta")).toBeInTheDocument();
        expect(queryByText("Facetexture")).toBeInTheDocument();

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
    it("Check render normal user authenticated 2", () => {
        const session = {
            expires: new Date(Date.now() + 2 * 86400).toISOString(),
            user: { name: "Teste123", isSuperuser: false },
        };
        (useSession as jest.Mock).mockReturnValue({ data: session, status: "authenticated" });
        const { baseElement, getByText, queryByText } = renderWithProviders(<MenuAdmin selected={["home"]} />);
        expect(baseElement).toBeInTheDocument();

        expect(getByText("Kawori")).toBeInTheDocument();
        expect(getByText("Inicio")).toBeInTheDocument();

        expect(queryByText("Conta")).toBeInTheDocument();
        expect(queryByText("Facetexture")).toBeInTheDocument();

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
    it("Check render super user authenticated", async () => {
        const session = {
            expires: new Date(Date.now() + 2 * 86400).toISOString(),
            user: { name: "Teste123", isSuperuser: true },
        };
        (useSession as jest.Mock).mockReturnValue({ data: session, status: "authenticated" });
        const { baseElement, getByText, queryByText } = renderWithProviders(<MenuAdmin selected={["home"]} />);

        expect(baseElement).toBeInTheDocument();

        expect(getByText("Kawori")).toBeInTheDocument();
        expect(getByText("Inicio")).toBeInTheDocument();

        expect(queryByText("Conta")).toBeInTheDocument();
        expect(queryByText("Facetexture")).toBeInTheDocument();

        expect(queryByText("Remoto")).toBeInTheDocument();
        expect(queryByText("Financeiro")).toBeInTheDocument();
        expect(queryByText("Servidor")).toBeInTheDocument();

        fireEvent.click(getByText("Remoto"));

        expect(queryByText("Comando")).toBeInTheDocument();
        expect(queryByText("Status")).toBeInTheDocument();

        fireEvent.click(getByText("Financeiro"));

        expect(queryByText("Overview")).toBeInTheDocument();
        expect(queryByText("Contratos")).toBeInTheDocument();
        expect(queryByText("Notas")).toBeInTheDocument();
        expect(queryByText("Pagamentos")).toBeInTheDocument();
        expect(queryByText("Tags")).toBeInTheDocument();

        expect(queryByText("Servidor")).toBeInTheDocument();
    });
});
