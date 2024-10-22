import { renderHook, act } from "@testing-library/react-hooks";
import { useSelector } from "react-redux";
import useMenu from "./useMenu";

// Mock the useAppSelector hook
jest.mock("@/lib/hooks", () => ({
    useAppSelector: jest.fn(),
}));

describe("useMenu", () => {
    const mockState = {
        auth: {
            status: "authenticated",
            user: { id: 1, name: "John Doe" },
            selectedMenu: "home",
        },
    };

    beforeEach(() => {
        (useSelector as jest.Mock).mockImplementation((selector) => selector(mockState));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return initial state correctly", () => {
        const { result } = renderHook(() => useMenu());

        expect(result.current.status).toBe("authenticated");
        expect(result.current.user).toEqual({ id: 1, name: "John Doe" });
        expect(result.current.selectedMenu).toBe("home");
        expect(result.current.collapsed).toBe(false);
    });

    it("should toggle collapsed state", () => {
        const { result } = renderHook(() => useMenu());

        act(() => {
            result.current.toggleCollapsed();
        });

        expect(result.current.collapsed).toBe(true);

        act(() => {
            result.current.toggleCollapsed();
        });

        expect(result.current.collapsed).toBe(false);
    });
});
