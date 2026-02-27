import { fetchFacetexture } from "@/lib/features/facetexture";
import { db } from "@/util/db";
import { renderWithProviders } from "@/util/test-utils";
import { screen, waitFor } from "@testing-library/react";
import FaceTexture from "./page";

jest.mock("@/components/themeProvider/themeContext", () => ({
    useTheme: () => ({ state: { theme: "light" } }),
}));

jest.mock("antd", () => ({
    message: { loading: jest.fn(), success: jest.fn() },
    Breadcrumb: ({ items }: any) => (
        <nav>{items?.map((i: any) => <span key={i.title}>{i.title}</span>)}</nav>
    ),
}));

// Mock the Loading skeleton to avoid pulling in full antd Skeleton/SkeletonImage
jest.mock("./loading", () => () => <div>Carregando</div>);

// Mock heavy child components to avoid their antd/service transitive imports
jest.mock("@/components/facetexture/background", () => ({ theme }: any) => <div>Background</div>);
jest.mock("@/components/facetexture/characters", () => ({ theme }: any) => <div>Characters</div>);
jest.mock("@/components/facetexture/preview", () => ({ theme }: any) => <div>Preview</div>);

// Fully self-contained mock — no jest.requireActual to avoid loading Sentry/axios chain
jest.mock("@/lib/features/facetexture", () => {
    const FULFILLED = "facetexture/fetchFacetexture/fulfilled";
    const UPDATE_BG = "facetexture/updateBackgroundReducer";

    const mockInitialState = {
        loading: true,
        backgroundUrl: "",
        class: [],
        facetexture: [],
        selected: undefined,
        edited: false,
        error: false,
        modal: {
            newFacetexture: { visible: false, saving: false, data: { name: "", visible: true, classId: 0 } },
        },
    };

    // Minimal reducer that handles only what the component dispatches
    function facetextureReducer(state = mockInitialState, action: any) {
        if (action.type === FULFILLED) {
            return {
                ...state,
                loading: false,
                facetexture: action.payload.characters,
                class: action.payload.classes.class,
            };
        }
        if (action.type === UPDATE_BG) {
            return { ...state, backgroundUrl: action.payload };
        }
        return state;
    }

    const mockCharacters = [
        {
            id: 1,
            name: "TestChar",
            class: { id: 1, name: "Warrior", abbreviation: "W", class_image: "" },
            show: true,
            image: "",
            order: 1,
        },
    ];

    // Thunk resolves asynchronously (setTimeout 0) so test 1 can assert the loading state
    // before the fulfilled action is dispatched
    const mockFetchFacetexture: any = jest.fn(
        () => (dispatch: any) =>
            new Promise<void>((resolve) => {
                setTimeout(() => {
                    const payload = { characters: mockCharacters, classes: { class: [] } };
                    dispatch({ type: FULFILLED, payload });
                    resolve({ type: FULFILLED, payload } as any);
                }, 0);
            }),
    );

    return {
        __esModule: true,
        default: facetextureReducer,
        fetchFacetexture: mockFetchFacetexture,
        updateBackgroundReducer: (url: string) => ({ type: UPDATE_BG, payload: url }),
        updateFacetextureUrlReducer: (data: any) => ({
            type: "facetexture/updateFacetextureUrl",
            payload: data,
        }),
        setSelectedMenu: (menu: string[]) => ({ type: "facetexture/setSelectedMenu", payload: menu }),
    };
});

// Prevent module-level apiAuth.get("/csrf/") in services/auth/index.ts from
// creating an unhandled rejection that gets attributed to async tests
jest.mock("@/services/auth", () => ({
    refreshTokenAsync: jest.fn(),
    refreshTokenService: jest.fn(),
    signupService: jest.fn(),
}));

jest.mock("@/util/db", () => ({
    db: {
        background: {
            toArray: jest.fn(),
            add: jest.fn(),
        },
        image: {
            where: jest.fn().mockReturnThis(),
            equals: jest.fn().mockReturnThis(),
            first: jest.fn(),
        },
    },
}));

// Mock fetch used for the default background image download
global.fetch = jest.fn().mockResolvedValue({
    blob: () => Promise.resolve(new Blob()),
}) as jest.Mock;

// jsdom doesn't implement URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => "blob:mock-url");

describe("FaceTexture", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (db.background.toArray as jest.Mock).mockResolvedValue([]);
        (db.background.add as jest.Mock).mockResolvedValue(undefined);
        (db.image.first as jest.Mock).mockResolvedValue(null);
        (global.fetch as jest.Mock).mockResolvedValue({
            blob: () => Promise.resolve(new Blob()),
        });
    });

    it("should render loading component when loading", () => {
        renderWithProviders(<FaceTexture />);

        // Checked synchronously before the async thunk's setTimeout fires
        expect(screen.getByText("Carregando")).toBeInTheDocument();
    });

    it("should render the FaceTexture component", async () => {
        renderWithProviders(<FaceTexture />);

        // Wait for the fulfilled action to transition loading → false
        await waitFor(() => {
            expect(screen.getByText(/Perdido\? Precisa de ajuda\?/)).toBeInTheDocument();
        });
        expect(screen.getByText("guia em video")).toBeInTheDocument();
        expect(screen.getByText("nosso discord.")).toBeInTheDocument();
    });

    it("should dispatch fetchFacetexture on mount", async () => {
        renderWithProviders(<FaceTexture />);

        await waitFor(() => {
            expect(fetchFacetexture).toHaveBeenCalled();
        });
    });

    it("should update document title on mount", () => {
        renderWithProviders(<FaceTexture />);

        expect(document.title).toBe("Kawori Facetexture");
    });

    it("should update background image", async () => {
        const mockBackground = { image: new Blob() };
        (db.background.toArray as jest.Mock).mockResolvedValueOnce([mockBackground]);

        renderWithProviders(<FaceTexture />);

        await waitFor(() => {
            expect(db.background.toArray).toHaveBeenCalled();
        });
    });

    it("should update character image", async () => {
        const mockImage = { imagem: new Blob() };
        (db.image.first as jest.Mock).mockResolvedValueOnce(mockImage);

        renderWithProviders(<FaceTexture />);

        await waitFor(() => {
            expect(db.image.where).toHaveBeenCalled();
        });
    });
});
