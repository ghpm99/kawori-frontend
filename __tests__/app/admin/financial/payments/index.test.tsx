import FinancialPage from "@/app/admin/financial/payments/page.tsx";
import { renderWithProviders } from "@/util/test-utils";

describe("Test Payment page", () => {
    test("Render page", () => {
        const { baseElement } = renderWithProviders(<FinancialPage />);
        expect(baseElement).toBeInTheDocument();
    });
});
