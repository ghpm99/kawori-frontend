import FinancialPage from "@/app/admin/financial/payments/page.tsx";
import { renderWithProviders } from "@/util/test-utils";
import { screen, fireEvent } from "@testing-library/react";
import {
    fetchAllPayment,
    cleanFilterPayments,
    setFilterPayments,
    changeVisibleModalPayoffPayments,
} from "@/lib/features/financial/payment";
import { setSelectedMenu } from "@/lib/features/auth";
import dayjs from "dayjs";

jest.mock("@/lib/features/financial/payment", () => ({
    fetchAllPayment: jest.fn(),
    cleanFilterPayments: jest.fn(),
    setFilterPayments: jest.fn(),
    changeVisibleModalPayoffPayments: jest.fn(),
}));

jest.mock("@/lib/features/auth", () => ({
    setSelectedMenu: jest.fn(),
}));

describe("Test Payment page", () => {
    test("Render page", () => {
        const { baseElement } = renderWithProviders(<FinancialPage />);
        expect(baseElement).toBeInTheDocument();
    });

    test("Set document title and dispatch actions on mount", () => {
        renderWithProviders(<FinancialPage />);
        expect(document.title).toBe("Kawori Pagamentos");
        expect(setSelectedMenu).toHaveBeenCalledWith(["financial", "payments"]);
        expect(fetchAllPayment).toHaveBeenCalledWith({
            page: 1,
            active: true,
            status: 0,
            page_size: 20,
        });
    });

    test("Clean filter button dispatches cleanFilterPayments and fetchAllPayment", () => {
        renderWithProviders(<FinancialPage />);
        const cleanFilterButton = screen.getByText("Limpar filtros");
        fireEvent.click(cleanFilterButton);
        expect(cleanFilterPayments).toHaveBeenCalled();
        expect(fetchAllPayment).toHaveBeenCalledWith({
            page: 1,
            active: true,
            status: 0,
            page_size: 20,
        });
    });

    test("Apply filter dispatches fetchAllPayment with current filters", () => {
        renderWithProviders(<FinancialPage />);
        const applyFilterButton = screen.getByText("Baixar pagamentos");
        fireEvent.click(applyFilterButton);
        expect(fetchAllPayment).toHaveBeenCalled();
    });

    test("Handle change filter dispatches setFilterPayments", () => {
        renderWithProviders(<FinancialPage />);
        const input = screen.getByPlaceholderText("Nome");
        fireEvent.change(input, { target: { value: "Test Name" } });
        expect(setFilterPayments).toHaveBeenCalledWith({ name: "name__icontains", value: "Test Name" });
    });

    test("Handle date range filter dispatches setFilterPayments", () => {
        renderWithProviders(<FinancialPage />);
        const dateRangePicker = screen.getByPlaceholderText("Data");
        fireEvent.change(dateRangePicker, {
            target: { value: [dayjs().format("DD/MM/YYYY"), dayjs().format("DD/MM/YYYY")] },
        });
        expect(setFilterPayments).toHaveBeenCalledWith({ name: "date__gte", value: dayjs().format("YYYY-MM-DD") });
        expect(setFilterPayments).toHaveBeenCalledWith({ name: "date__lte", value: dayjs().format("YYYY-MM-DD") });
    });

    test("Toggle payoff modal visibility", () => {
        renderWithProviders(<FinancialPage />);
        const payoffButton = screen.getByText("Baixar pagamentos");
        fireEvent.click(payoffButton);
        expect(changeVisibleModalPayoffPayments).toHaveBeenCalled();
    });
});
