import React from "react";
import { render } from "@testing-library/react";
import PaymentWithFixed from "./index";
import { IPaymentCharts } from "@/types"; // Adjust the import path as necessary

describe("PaymentWithFixed Component", () => {
    const mockData: IPaymentCharts[] = [
        { label: "2023-01", credit: 100, debit: 50, difference: 50 },
        { label: "2023-02", credit: 200, debit: 100, difference: 100 },
        { label: "2023-03", credit: 300, debit: 150, difference: 150 },
    ];

    test("should render without crashing", () => {
        const { container } = render(<PaymentWithFixed data={mockData} />);
        expect(container).toBeInTheDocument();
    });

    test("should display the correct chart title", () => {
        const { getByText } = render(<PaymentWithFixed data={mockData} />);
        expect(getByText("Relatorio pagamentos")).toBeInTheDocument();
    });

    test("should have the correct number of datasets", () => {
        const { container } = render(<PaymentWithFixed data={mockData} />);
        const datasets = container.querySelectorAll(".chart-container canvas");
        expect(datasets.length).toBe(1); // Since we are rendering a single Line chart
    });

    test("should display the correct labels", () => {
        const { getByText } = render(<PaymentWithFixed data={mockData} />);
        mockData.forEach((data) => {
            expect(getByText(formatterMonthYearDate(data.label))).toBeInTheDocument();
        });
    });
});
