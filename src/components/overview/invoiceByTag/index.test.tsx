import React from "react";
import { render } from "@testing-library/react";
import InvoiceByTag from "./index";

describe("InvoiceByTag Component", () => {
    const mockData = [
        { name: "Tag1", amount: 100, color: "#FF6384" },
        { name: "Tag2", amount: 200, color: "#36A2EB" },
        { name: "Tag3", amount: 300, color: "#FFCE56" },
    ];

    test("should render without crashing", () => {
        const { container } = render(<InvoiceByTag data={mockData} />);
        expect(container).toBeInTheDocument();
    });

    test("should display the correct number of tags", () => {
        const { getByText } = render(<InvoiceByTag data={mockData} />);
        mockData.forEach((item) => {
            expect(getByText(item.name)).toBeInTheDocument();
        });
    });

    test("should display the chart with correct data", () => {
        const { container } = render(<InvoiceByTag data={mockData} />);
        const canvas = container.querySelector("canvas");
        expect(canvas).toBeInTheDocument();
    });
});
