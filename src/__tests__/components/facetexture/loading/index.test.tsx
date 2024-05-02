import { renderWithProviders } from "@/tests/util/test-utils";
import "@testing-library/jest-dom";
import Loading from "../../../../components/facetexture/loading";

Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

describe("Test Characters container", () => {
    it("Check render", () => {
        const { baseElement, getByText, getAllByText } = renderWithProviders(<Loading />);
        expect(baseElement).toBeInTheDocument();
        expect(baseElement).toMatchSnapshot();

        expect(getByText("Conta")).toBeInTheDocument();
        expect(getAllByText("Kawori")).toHaveLength(2);
        expect(getAllByText("Facetexture")).toHaveLength(2);
        expect(getByText("Personagens")).toBeInTheDocument();
        expect(getByText("Background")).toBeInTheDocument();
        expect(getByText("Preview")).toBeInTheDocument();
    });
});
