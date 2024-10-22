import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserPanel from "./index";
import useUserPanel from "./useUserPanel";

jest.mock("./useUserPanel");

describe("UserPanel Component", () => {
    const mockUseUserPanel = useUserPanel as jest.MockedFunction<typeof useUserPanel>;

    beforeEach(() => {
        mockUseUserPanel.mockReturnValue({
            user: {
                name: "Test User",
                date_joined: "2023-01-01",
                last_login: "2023-01-02",
                is_active: true,
            },
            status: "authenticated",
            formatDate: (date: string) => new Date(date).toLocaleDateString(),
        });
    });

    test("renders login and signup tabs when unauthenticated", () => {
        mockUseUserPanel.mockReturnValueOnce({
            user: null,
            status: "unauthenticated",
            formatDate: jest.fn(),
        });

        render(<UserPanel />);

        expect(screen.getByText("Cadastro")).toBeInTheDocument();
        expect(screen.getByText("Login")).toBeInTheDocument();
    });

    test("renders user information when authenticated", () => {
        render(<UserPanel />);

        expect(screen.getByText("Usuario logado")).toBeInTheDocument();
        expect(screen.getByText("Nome: Test User")).toBeInTheDocument();
        expect(screen.getByText("Data de cadastro: 1/1/2023")).toBeInTheDocument();
        expect(screen.getByText("Ultimo login: 1/2/2023")).toBeInTheDocument();
        expect(screen.getByText("Ativo")).toBeInTheDocument();
    });

    test("renders quick access links", () => {
        render(<UserPanel />);

        expect(screen.getByText("Perfil")).toBeInTheDocument();
        expect(screen.getByText("Facetexture")).toBeInTheDocument();
        expect(screen.getByText("Rank de Classes")).toBeInTheDocument();
    });

    test("renders logout button", () => {
        render(<UserPanel />);

        const logoutButton = screen.getByText("Deslogar");
        expect(logoutButton).toBeInTheDocument();
        expect(logoutButton).toHaveAttribute("href", "/signout");
    });

    test("handles user status correctly", () => {
        mockUseUserPanel.mockReturnValueOnce({
            user: {
                name: "Test User",
                date_joined: "2023-01-01",
                last_login: "2023-01-02",
                is_active: false,
            },
            status: "authenticated",
            formatDate: (date: string) => new Date(date).toLocaleDateString(),
        });

        render(<UserPanel />);

        expect(screen.getByText("Banido")).toBeInTheDocument();
    });
});
