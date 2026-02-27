import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ModalNewInvoice, { IModalNewInvoiceProps } from "./index";

jest.mock("antd", () => {
    const React = require("react");

    const MockFormItem = ({ label, name, children, valuePropName, style, rules }: any) => {
        const id = name || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : "field");
        const child = children ? React.Children.only(children) : null;
        const childWithProps = child ? React.cloneElement(child, { id, "aria-label": label }) : null;
        return (
            <div>
                {label && <label htmlFor={id}>{label}</label>}
                {childWithProps}
            </div>
        );
    };

    const MockForm = ({ children, onFinish, form }: any) => {
        if (form && form._setOnFinish) form._setOnFinish(onFinish);
        return <div>{children}</div>;
    };
    MockForm.Item = MockFormItem;
    MockForm.useForm = () => {
        const onFinishRef = React.useRef(null);
        const formRef = React.useRef({
            submit: () => {
                if (onFinishRef.current) onFinishRef.current({});
            },
            _setOnFinish: (fn: any) => {
                onFinishRef.current = fn;
            },
        });
        return [formRef.current];
    };

    const MockOption = ({ children }: any) => <div role="option">{children}</div>;
    const MockSelect = ({ children, id, "aria-label": ariaLabel, mode, placeholder }: any) => {
        const [open, setOpen] = React.useState(false);
        return (
            <div>
                <div
                    id={id}
                    aria-label={ariaLabel}
                    role="combobox"
                    tabIndex={0}
                    onMouseDown={() => setOpen(true)}
                />
                {open && <div role="listbox">{children}</div>}
            </div>
        );
    };
    MockSelect.Option = MockOption;

    const MockModal = ({ title, children, open: isOpen, onCancel, onOk }: any) =>
        isOpen ? (
            <div>
                <div>{title}</div>
                {children}
                <button onClick={onCancel}>Cancel</button>
                <button onClick={onOk}>OK</button>
            </div>
        ) : null;

    return {
        Modal: MockModal,
        Form: MockForm,
        Input: ({ id, "aria-label": ariaLabel, placeholder }: any) => (
            <input id={id} aria-label={ariaLabel} placeholder={placeholder} />
        ),
        InputNumber: ({ id, "aria-label": ariaLabel }: any) => (
            <input type="number" id={id} aria-label={ariaLabel} />
        ),
        DatePicker: ({ id, "aria-label": ariaLabel }: any) => (
            <input type="date" id={id} aria-label={ariaLabel} />
        ),
        Select: MockSelect,
        Switch: ({ id, "aria-label": ariaLabel }: any) => (
            <input type="checkbox" id={id} aria-label={ariaLabel} />
        ),
    };
});

const mockTags: ITags[] = [
    { id: 1, name: "Tag1", color: "" },
    { id: 2, name: "Tag2", color: "" },
];

const defaultProps: IModalNewInvoiceProps = {
    visible: true,
    onCancel: jest.fn(),
    onFinish: jest.fn(),
    tags: mockTags,
};

describe("ModalNewInvoice", () => {
    test("renders correctly", () => {
        render(<ModalNewInvoice {...defaultProps} />);
        expect(screen.getByText("Nova entrada")).toBeInTheDocument();
        expect(screen.getByLabelText("Tipo")).toBeInTheDocument();
        expect(screen.getByLabelText("Nome")).toBeInTheDocument();
        expect(screen.getByLabelText("Data")).toBeInTheDocument();
        expect(screen.getByLabelText("Parcelas")).toBeInTheDocument();
        expect(screen.getByLabelText("Dia de pagamento")).toBeInTheDocument();
        expect(screen.getByLabelText("Valor")).toBeInTheDocument();
        expect(screen.getByLabelText("Tags")).toBeInTheDocument();
        expect(screen.getByLabelText("Entrada mensal")).toBeInTheDocument();
    });

    test.skip("calls onFinish when form is submitted", () => {
        render(<ModalNewInvoice {...defaultProps} />);
        fireEvent.change(screen.getByPlaceholderText("Digite o nome"), { target: { value: "Test Name" } });
        fireEvent.change(screen.getByPlaceholderText(/selecione o tipo de entrada/i), { target: { value: 0 } });
        fireEvent.change(screen.getByPlaceholderText("Digite o valor"), { target: { value: 100 } });
        fireEvent.click(screen.getByRole("button", { name: /ok/i }));
        expect(defaultProps.onFinish).toHaveBeenCalled();
    });

    test("calls onCancel when cancel button is clicked", () => {
        render(<ModalNewInvoice {...defaultProps} />);
        fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
        expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    test("renders tags correctly", () => {
        render(<ModalNewInvoice {...defaultProps} />);
        fireEvent.mouseDown(screen.getByLabelText("Tags"));
        expect(screen.getByText("Tag1")).toBeInTheDocument();
        expect(screen.getByText("Tag2")).toBeInTheDocument();
    });
});
