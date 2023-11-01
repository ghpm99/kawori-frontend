import { renderWithProviders } from "@/util/test-utils";
import Characters from ".";

describe("Test Characters container", () => {
    it("Check render", () => {
        const { baseElement, getByText } = renderWithProviders(<Characters />);
        expect(baseElement).toBeInTheDocument();
        expect(getByText("Incluir Novo Personagem")).toBeInTheDocument();
    });
});
