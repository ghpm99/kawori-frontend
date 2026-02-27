import LoginPage from "@/components/signin";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

describe("LoginPage", () => {
    test("should render the login form", () => {
        render(<LoginPage loading={false} hasError={false} onFinish={jest.fn()} onFinishFailed={jest.fn()} />);

        expect(screen.getByLabelText("Usuario")).toBeInTheDocument();
        expect(screen.getByLabelText("Senha")).toBeInTheDocument();
        expect(screen.getByText("Logar")).toBeInTheDocument();
    });

    test("should show an error message when hasError is true", () => {
        render(<LoginPage loading={false} hasError={true} onFinish={jest.fn()} onFinishFailed={jest.fn()} />);

        expect(screen.getByText(/usuario ou senha incorretos/i)).toBeInTheDocument();
    });

    test("should not show error message when hasError is false", () => {
        render(<LoginPage loading={false} hasError={false} onFinish={jest.fn()} onFinishFailed={jest.fn()} />);

        expect(screen.queryByText(/usuario ou senha incorretos/i)).not.toBeInTheDocument();
    });

    test("should call onFinish when form is submitted with valid values", async () => {
        const onFinish = jest.fn();
        render(<LoginPage loading={false} hasError={false} onFinish={onFinish} onFinishFailed={jest.fn()} />);

        fireEvent.change(screen.getByLabelText("Usuario"), { target: { value: "testuser" } });
        fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "testpassword" } });
        fireEvent.click(screen.getByText("Logar"));

        await waitFor(() => {
            expect(onFinish).toHaveBeenCalled();
        });
    });

    test("should call onFinishFailed when form is submitted without required fields", async () => {
        const onFinishFailed = jest.fn();
        render(<LoginPage loading={false} hasError={false} onFinish={jest.fn()} onFinishFailed={onFinishFailed} />);

        fireEvent.click(screen.getByText("Logar"));

        await waitFor(() => {
            expect(onFinishFailed).toHaveBeenCalled();
        });
    });
});
