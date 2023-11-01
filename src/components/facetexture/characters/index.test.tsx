import { renderWithProviders } from "@/util/test-utils";
import Characters from ".";

describe("Test Characters container", () => {
    it("Check render", () => {
        const { baseElement } = renderWithProviders(<Characters />);
        expect(baseElement).toBeInTheDocument();
    });
});
