import {
    fetchFacetextureService,
    fetchFaceTextureClassService,
    previewFacetextureService,
    downloadFacetextureService,
    newCharacterThunk,
    reorderCharacterThunk,
    changeClassCharacterThunk,
    changeCharacterNameThunk,
    changeShowClassThunk,
    deleteCharacterThunk,
} from "./index";
import { apiDjango } from "..";

jest.mock("..", () => ({
    apiDjango: {
        get: jest.fn(),
        post: jest.fn(),
    },
}));

describe("Facetexture Service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("fetchFacetextureService should fetch facetexture data", async () => {
        const mockData = { characters: [] };
        (apiDjango.get as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await fetchFacetextureService();
        expect(apiDjango.get).toHaveBeenCalledWith("/facetexture/");
        expect(result).toEqual(mockData);
    });

    test("fetchFaceTextureClassService should fetch facetexture class data", async () => {
        const mockData = {};
        (apiDjango.get as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await fetchFaceTextureClassService();
        expect(apiDjango.get).toHaveBeenCalledWith("/facetexture/class");
        expect(result).toEqual(mockData);
    });

    test("previewFacetextureService should preview facetexture", async () => {
        const mockData = new Blob();
        const args = { some: "data" };
        (apiDjango.post as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await previewFacetextureService(args);
        expect(apiDjango.post).toHaveBeenCalledWith("/facetexture/preview", args, {
            responseType: "blob",
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        expect(result).toEqual(mockData);
    });

    test("downloadFacetextureService should download facetexture", async () => {
        const mockData = new Blob();
        const args = { some: "data" };
        (apiDjango.post as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await downloadFacetextureService(args);
        expect(apiDjango.post).toHaveBeenCalledWith("/facetexture/download", args, {
            responseType: "blob",
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        expect(result).toEqual(mockData);
    });

    test("newCharacterThunk should create a new character", async () => {
        const mockData = { id: 1 };
        const facetexture = { name: "New Character" };
        (apiDjango.post as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await newCharacterThunk(facetexture, { dispatch: jest.fn(), getState: jest.fn(), extra: {} });
        expect(apiDjango.post).toHaveBeenCalledWith("facetexture/new", facetexture);
        expect(result.payload).toEqual(mockData);
    });

    test("reorderCharacterThunk should reorder a character", async () => {
        const mockData = { success: true };
        const args = { id: 1, indexDestination: 2 };
        (apiDjango.post as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await reorderCharacterThunk(args, { dispatch: jest.fn(), getState: jest.fn(), extra: {} });
        expect(apiDjango.post).toHaveBeenCalledWith(`facetexture/${args.id}/reorder`, {
            index_destination: args.indexDestination,
        });
        expect(result.payload).toEqual(mockData);
    });

    test("changeClassCharacterThunk should change character class", async () => {
        const mockData = { success: true };
        const args = { id: 1, classId: 2 };
        (apiDjango.post as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await changeClassCharacterThunk(args, { dispatch: jest.fn(), getState: jest.fn(), extra: {} });
        expect(apiDjango.post).toHaveBeenCalledWith(`facetexture/${args.id}/change-class`, { new_class: args.classId });
        expect(result.payload).toEqual({ data: mockData, id: args.id });
    });

    test("changeCharacterNameThunk should change character name", async () => {
        const mockData = { success: true };
        const args = { id: 1, name: "New Name" };
        (apiDjango.post as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await changeCharacterNameThunk(args, { dispatch: jest.fn(), getState: jest.fn(), extra: {} });
        expect(apiDjango.post).toHaveBeenCalledWith(`facetexture/${args.id}/change-name`, { name: args.name });
        expect(result.payload).toEqual({ data: mockData, id: args.id });
    });

    test("changeShowClassThunk should change character visibility", async () => {
        const mockData = { success: true };
        const args = { id: 1, visible: true };
        (apiDjango.post as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await changeShowClassThunk(args, { dispatch: jest.fn(), getState: jest.fn(), extra: {} });
        expect(apiDjango.post).toHaveBeenCalledWith(`facetexture/${args.id}/change-visible`, { show: args.visible });
        expect(result.payload).toEqual({ data: mockData, id: args.id, visible: args.visible });
    });

    test("deleteCharacterThunk should delete a character", async () => {
        const mockData = { success: true };
        const id = 1;
        (apiDjango.post as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await deleteCharacterThunk(id, { dispatch: jest.fn(), getState: jest.fn(), extra: {} });
        expect(apiDjango.post).toHaveBeenCalledWith(`facetexture/${id}/delete`);
        expect(result.payload).toEqual({ data: mockData, id });
    });
});
