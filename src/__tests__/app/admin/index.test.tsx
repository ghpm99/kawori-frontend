import { render } from "@testing-library/react";
import DashboardLayout from "@/app/admin/layout.tsx";

describe("Admin layout", () => {
    test("Should be render the component", () => {
        const { container } = render(
            <DashboardLayout>
                <div>test</div>
            </DashboardLayout>,
        );
        expect(container).toBeDefined();
    });
});
