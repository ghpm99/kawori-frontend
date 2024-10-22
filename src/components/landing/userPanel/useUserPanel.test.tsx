import { renderHook } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import useUserPanel from "./useUserPanel";
import { userDetailsThunk } from "@/lib/features/auth";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("useUserPanel", () => {
    let store: any;

    beforeEach(() => {
        store = mockStore({
            auth: {
                status: "idle",
                user: null,
            },
        });
    });

    test("should dispatch userDetailsThunk on mount", () => {
        renderHook(() => useUserPanel(), {
            wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
        });

        const actions = store.getActions();
        expect(actions).toContainEqual(userDetailsThunk());
    });

    test("should return the correct status and user from the store", () => {
        store = mockStore({
            auth: {
                status: "loading",
                user: { id: 1, name: "John Doe" },
            },
        });

        const { result } = renderHook(() => useUserPanel(), {
            wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
        });

        expect(result.current.status).toBe("loading");
        expect(result.current.user).toEqual({ id: 1, name: "John Doe" });
    });

    test("should format date correctly", () => {
        const { result } = renderHook(() => useUserPanel(), {
            wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
        });

        const formattedDate = result.current.formatDate("2023-10-01T12:00:00Z");
        expect(formattedDate).toBe(new Date("2023-10-01T12:00:00Z").toLocaleString());
    });
});
