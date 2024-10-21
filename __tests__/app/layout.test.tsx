import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";

jest.mock("next/navigation");

describe("RootLayout", () => {
    test("should render the layout", () => {
        render(
            <RootLayout>
                <div>Teste</div>
            </RootLayout>,
        );
        expect(screen.getByText("Teste")).toBeInTheDocument();
    });
});
