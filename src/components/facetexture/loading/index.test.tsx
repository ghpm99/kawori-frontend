import { renderWithProviders } from "@/util/test-utils";
import "@testing-library/jest-dom";
import Loading from ".";

jest.mock("next-auth/react", () => {
    const originalModule = jest.requireActual("next-auth/react");
    const mockSession = {
        expires: new Date(Date.now() + 2 * 86400).toISOString(),
        user: { name: "Teste123" },
    };
    return {
        __esModule: true,
        ...originalModule,
        useSession: jest.fn(() => {
            return { data: mockSession, status: "authenticated" };
        }),
    };
});

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
