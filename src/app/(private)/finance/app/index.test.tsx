import { render } from "@testing-library/react";
import DashboardLayout from "@/app/(private)/finance/app/layout";
import { renderWithProviders } from "@/util/test-utils";

jest.mock("next/navigation");

describe("Admin layout", () => {
    test("Should be render the component", () => {
        const { container } = renderWithProviders(
            <DashboardLayout>
                <div>test</div>
            </DashboardLayout>,
        );
        expect(container).toBeDefined();
    });
});
