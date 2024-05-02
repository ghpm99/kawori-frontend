import { renderWithProviders } from "@/tests/util/test-utils";
import LoginHeader from "../../../components/loginHeader/Index";


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
        const { baseElement, getByRole } = renderWithProviders(<LoginHeader />);
        expect(baseElement).toBeInTheDocument();
        expect(getByRole("img")).toBeInTheDocument();
    });
});
