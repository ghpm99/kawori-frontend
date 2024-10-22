import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ModalFilter from "./index";

describe("ModalFilter Component", () => {
    const mockOnCancel = jest.fn();
    const mockSetFilters = jest.fn();

    const defaultProps = {
        visible: true,
        onCancel: mockOnCancel,
        setFilters: mockSetFilters,
    };

    const setup = (props = defaultProps) => {
        return render(<ModalFilter {...props} />);
    };

    it("should render the modal with correct title", () => {
        setup();
        expect(screen.getByText("Filtro")).toBeInTheDocument();
    });

    it("should call onCancel when cancel button is clicked", () => {
        setup();
        fireEvent.click(screen.getByText("Cancel"));
        expect(mockOnCancel).toHaveBeenCalled();
    });

    it("should call setFilters when form is submitted", () => {
        setup();
        fireEvent.click(screen.getByText("OK"));
        expect(mockSetFilters).toHaveBeenCalled();
    });

    it("should render all form fields", () => {
        setup();
        expect(screen.getByLabelText("Status")).toBeInTheDocument();
        expect(screen.getByLabelText("Tipo")).toBeInTheDocument();
        expect(screen.getByLabelText("Nome")).toBeInTheDocument();
        expect(screen.getByLabelText("Data")).toBeInTheDocument();
        expect(screen.getByLabelText("Parcelas")).toBeInTheDocument();
        expect(screen.getByLabelText("Dia de pagamento")).toBeInTheDocument();
        expect(screen.getByLabelText("Valor")).toBeInTheDocument();
        expect(screen.getByLabelText("Entrada mensal")).toBeInTheDocument();
        expect(screen.getByLabelText("Ativo")).toBeInTheDocument();
    });

    it("should render the correct options for status select", () => {
        setup();
        fireEvent.mouseDown(screen.getByLabelText("Status").firstChild);
        expect(screen.getByText("Todos")).toBeInTheDocument();
        expect(screen.getByText("Em aberto")).toBeInTheDocument();
        expect(screen.getByText("Baixado")).toBeInTheDocument();
    });

    it("should render the correct options for type select", () => {
        setup();
        fireEvent.mouseDown(screen.getByLabelText("Tipo").firstChild);
        expect(screen.getByText("Todos")).toBeInTheDocument();
        expect(screen.getByText("Credito")).toBeInTheDocument();
        expect(screen.getByText("Debito")).toBeInTheDocument();
    });

    it("should render the correct options for fixed select", () => {
        setup();
        fireEvent.mouseDown(screen.getByLabelText("Entrada mensal").firstChild);
        expect(screen.getByText("Todos")).toBeInTheDocument();
        expect(screen.getByText("Sim")).toBeInTheDocument();
        expect(screen.getByText("Não")).toBeInTheDocument();
    });

    it("should render the correct options for active select", () => {
        setup();
        fireEvent.mouseDown(screen.getByLabelText("Ativo").firstChild);
        expect(screen.getByText("Todos")).toBeInTheDocument();
        expect(screen.getByText("Sim")).toBeInTheDocument();
        expect(screen.getByText("Não")).toBeInTheDocument();
    });
});
