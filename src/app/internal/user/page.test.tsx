import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import User from "./page";
import { RootState } from "@/lib/store";

const mockStore = configureStore([]);

describe("User Page", () => {
    let store: ReturnType<typeof mockStore>;
    let initialState: RootState;

    beforeEach(() => {
        initialState = {
            auth: {
                user: {
                    name: "John Doe",
                    username: "johndoe",
                    is_superuser: false,
                    is_staff: true,
                    is_active: true,
                    first_name: "John",
                    last_name: "Doe",
                    email: "john.doe@example.com",
                    last_login: "2023-10-01T12:34:56Z",
                    date_joined: "2023-01-01T12:34:56Z",
                    image: "https://example.com/avatar.jpg",
                },
            },
        };
        store = mockStore(initialState);
    });

    test("renders user details correctly", () => {
        const { getByText, getByAltText } = render(
            <Provider store={store}>
                <User />
            </Provider>,
        );

        expect(getByText("Nome")).toBeInTheDocument();
        expect(getByText("John Doe")).toBeInTheDocument();
        expect(getByText("Username")).toBeInTheDocument();
        expect(getByText("johndoe")).toBeInTheDocument();
        expect(getByText("Status")).toBeInTheDocument();
        expect(getByText("Ativo")).toBeInTheDocument();
        expect(getByText("Primeiro nome")).toBeInTheDocument();
        expect(getByText("John")).toBeInTheDocument();
        expect(getByText("Ultimo nome")).toBeInTheDocument();
        expect(getByText("Doe")).toBeInTheDocument();
        expect(getByText("E-mail")).toBeInTheDocument();
        expect(getByText("john.doe@example.com")).toBeInTheDocument();
        expect(getByText("Ultimo login")).toBeInTheDocument();
        expect(getByText("1/10/2023, 12:34:56")).toBeInTheDocument();
        expect(getByText("Data cadastrada")).toBeInTheDocument();
        expect(getByText("1/1/2023, 12:34:56")).toBeInTheDocument();
        expect(getByText("Alterar senha")).toBeInTheDocument();
        expect(getByAltText("user avatar")).toBeInTheDocument();
    });

    test("applies correct border color based on user role", () => {
        const { container } = render(
            <Provider store={store}>
                <User />
            </Provider>,
        );

        const avatar = container.querySelector(".ant-avatar");
        expect(avatar).toHaveStyle("border: 1px solid violet");
    });
});
