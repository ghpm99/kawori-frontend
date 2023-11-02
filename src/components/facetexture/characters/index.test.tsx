import { renderWithProviders } from "@/util/test-utils";
import Characters from ".";

describe("Test Characters container", () => {
    it("Check render", () => {
        const { baseElement, getByText } = renderWithProviders(<Characters />);
        expect(baseElement).toBeInTheDocument();
        const buttonNewCharacter = getByText("Incluir Novo Personagem");
        expect(buttonNewCharacter).toBeInTheDocument();
        expect(buttonNewCharacter).toBeEnabled();
    });
});
