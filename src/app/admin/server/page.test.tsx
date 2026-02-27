import React from "react";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import ServerPage from "./page";
import { updateAllContractsValue } from "@/services/financial";
import { renderWithProviders } from "@/util/test-utils";

jest.mock("@/lib/hooks", () => ({
    useAppDispatch: () => jest.fn(),
}));

// Prevent module-level apiAuth.get("/csrf/") in services/auth/index.ts from
// creating an unhandled rejection that gets attributed to async tests
jest.mock("@/services/auth", () => ({
    refreshTokenAsync: jest.fn(),
    refreshTokenService: jest.fn(),
    signupService: jest.fn(),
}));

jest.mock("@/services/financial", () => ({
    updateAllContractsValue: jest.fn(),
}));

jest.mock("antd", () => {
    const MockBreadcrumb = ({ children }: any) => <div>{children}</div>;
    MockBreadcrumb.Item = ({ children }: any) => <span>{children}</span>;
    return {
        Breadcrumb: MockBreadcrumb,
        Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
        Layout: ({ children }: any) => <div>{children}</div>,
        message: { loading: jest.fn(), success: jest.fn() },
    };
});

jest.mock("@/components/loadingPage/Index", () => () => null);

describe("ServerPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should set document title and dispatch setSelectedMenu on mount", () => {
        jest.spyOn(React, "useEffect").mockImplementationOnce((f) => f());

        renderWithProviders(<ServerPage />);

        expect(document.title).toBe("Kawori Server");
    });

    test("should display breadcrumb items", () => {
        renderWithProviders(<ServerPage />);

        expect(screen.getByText("Kawori")).toBeInTheDocument();
        expect(screen.getByText("Servidor")).toBeInTheDocument();
    });

    test("should call updateContractsValue and display loading and success messages", async () => {
        const { message } = require("antd");
        const response = { data: { msg: "Contratos calculados com sucesso" } };
        (updateAllContractsValue as jest.Mock).mockResolvedValue(response);

        renderWithProviders(<ServerPage />);

        fireEvent.click(screen.getByText("Calcular valores contratos"));

        expect(message.loading).toHaveBeenCalledWith({
            content: "Calculando contratos",
            key: "calculate-contracts",
        });

        await waitFor(() => {
            expect(updateAllContractsValue).toHaveBeenCalled();
            expect(message.success).toHaveBeenCalledWith({
                content: response.data.msg,
                key: "calculate-contracts",
            });
        });
    });
});
