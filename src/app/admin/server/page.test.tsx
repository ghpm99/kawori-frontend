import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import ServerPage from "./page";
import { setSelectedMenu } from "@/lib/features/auth";
import { updateAllContractsValue } from "@/services/financial";
import { message } from "antd";

jest.mock("@/lib/hooks", () => ({
    useAppDispatch: () => jest.fn(),
}));

jest.mock("@/services/financial", () => ({
    updateAllContractsValue: jest.fn(),
}));

jest.mock("antd", () => ({
    ...jest.requireActual("antd"),
    message: {
        loading: jest.fn(),
        success: jest.fn(),
    },
}));

const mockStore = configureStore([]);
const store = mockStore({});

describe("ServerPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should set document title and dispatch setSelectedMenu on mount", () => {
        const dispatch = jest.fn();
        jest.spyOn(React, "useEffect").mockImplementationOnce((f) => f());

        render(
            <Provider store={store}>
                <ServerPage />
            </Provider>,
        );

        expect(document.title).toBe("Kawori Server");
        expect(dispatch).toHaveBeenCalledWith(setSelectedMenu(["server"]));
    });

    test("should display breadcrumb items", () => {
        render(
            <Provider store={store}>
                <ServerPage />
            </Provider>,
        );

        expect(screen.getByText("Kawori")).toBeInTheDocument();
        expect(screen.getByText("Servidor")).toBeInTheDocument();
    });

    test("should call updateContractsValue and display loading and success messages", async () => {
        const response = { data: { msg: "Contratos calculados com sucesso" } };
        (updateAllContractsValue as jest.Mock).mockResolvedValue(response);

        render(
            <Provider store={store}>
                <ServerPage />
            </Provider>,
        );

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
