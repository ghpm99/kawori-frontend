import { render } from "@testing-library/react";
import LoadingPage from "../../../src/components/loadingPage/Index";

describe("Test Characters container", () => {
    test("Check render", async () => {
        const { baseElement, getByText } = render(<LoadingPage />);
        expect(baseElement).toBeInTheDocument();
        expect(getByText("Carregando...")).toBeInTheDocument();
    });
});
