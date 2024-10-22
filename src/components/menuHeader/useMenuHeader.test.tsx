import { renderHook } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import useMenuHeader from "./useMenuHeader";
import { RootState } from "@/lib/store";

const mockStore = configureStore([]);
const initialState: RootState = {
    auth: {
        status: "logged_in",
        user: { id: 1, name: "John Doe" },
    },
};

describe("useMenuHeader", () => {
    let store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        store = mockStore(initialState);
    });

    test("should return status and user data from the state", () => {
        const { result } = renderHook(() => useMenuHeader(), {
            wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
        });

        expect(result.current.status).toBe("logged_in");
        expect(result.current.data).toEqual({ id: 1, name: "John Doe" });
    });
});
