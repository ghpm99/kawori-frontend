import React from "react";
import { render } from "@testing-library/react";

import PaymentFixed from "./index";

describe("PaymentFixed Component", () => {
    test("renders without crashing", () => {
        const { getByText } = render(<PaymentFixed fixedCredit={100} fixedDebit={50} />);
        expect(getByText("Relatorio pagamentos mensais")).toBeInTheDocument();
    });

    test("displays correct credit and debit values", () => {
        const { getByText } = render(<PaymentFixed fixedCredit={200} fixedDebit={100} />);
        expect(getByText("Credito")).toBeInTheDocument();
        expect(getByText("Debito")).toBeInTheDocument();
    });

    test("renders the chart with correct data", () => {
        const { container } = render(<PaymentFixed fixedCredit={300} fixedDebit={150} />);
        const canvas = container.querySelector("canvas");
        expect(canvas).toBeInTheDocument();
    });
});
