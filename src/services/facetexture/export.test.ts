import { saveAs } from "file-saver";

import { db } from "@/util/db";
import { buildFacetextureExport, exportFacetextureData, FACETEXTURE_EXPORT_FILENAME } from "./export";
import { fetchFacetextureService, IFacetextureCharacterApi } from ".";

jest.mock("file-saver", () => ({ saveAs: jest.fn() }));

jest.mock(".", () => ({ fetchFacetextureService: jest.fn() }));

jest.mock("@/util/db", () => ({
    db: {
        image: { where: jest.fn() },
        background: { toArray: jest.fn() },
    },
}));

const mockedFetch = fetchFacetextureService as jest.Mock;
const mockedImageWhere = db.image.where as jest.Mock;
const mockedBackgroundToArray = db.background.toArray as jest.Mock;

const buildCharacter = (overrides: Partial<IFacetextureCharacterApi>): IFacetextureCharacterApi => ({
    id: 1,
    name: "Char",
    class: { id: 1, name: "Warrior", abbreviation: "WR", class_image: "wr.png" },
    show: true,
    image: {},
    order: 0,
    ...overrides,
});

const pngBlob = (content: string) => new Blob([content], { type: "image/png" });

const mockStoredImage = (byName: Record<string, Blob | undefined>) => {
    mockedImageWhere.mockReturnValue({
        equals: (name: string) => ({
            first: () => Promise.resolve(byName[name] ? { name, imagem: byName[name] } : undefined),
        }),
    });
};

beforeEach(() => {
    jest.clearAllMocks();
    mockStoredImage({});
    mockedBackgroundToArray.mockResolvedValue([]);
});

describe("buildFacetextureExport", () => {
    it("ordena os personagens por order e resolve imagens como data-URL", async () => {
        mockedFetch.mockResolvedValue({
            characters: [
                buildCharacter({ id: 2, name: "Bravo", order: 2 }),
                buildCharacter({ id: 1, name: "Alfa", order: 0 }),
            ],
        });
        mockStoredImage({ Alfa: pngBlob("alfa") });

        const result = await buildFacetextureExport();

        expect(result.characters.map((c) => c.name)).toEqual(["Alfa", "Bravo"]);
        expect(result.characters[0].image).toMatch(/^data:image\/png;base64,/);
        expect(result.characters[0]).toMatchObject({ classId: 1, classAbbreviation: "WR", show: true, order: 0 });
    });

    it("usa image null quando o personagem não tem rosto salvo localmente", async () => {
        mockedFetch.mockResolvedValue({ characters: [buildCharacter({ name: "SemRosto" })] });

        const result = await buildFacetextureExport();

        expect(result.characters[0].image).toBeNull();
    });

    it("usa background null quando não há background salvo", async () => {
        mockedFetch.mockResolvedValue({ characters: [] });
        mockedBackgroundToArray.mockResolvedValue([]);

        const result = await buildFacetextureExport();

        expect(result.background).toBeNull();
    });

    it("resolve o background salvo como data-URL", async () => {
        mockedFetch.mockResolvedValue({ characters: [] });
        mockedBackgroundToArray.mockResolvedValue([{ id: 1, image: pngBlob("bg") }]);

        const result = await buildFacetextureExport();

        expect(result.background).toMatch(/^data:image\/png;base64,/);
    });

    it("gera o schema v1 com exportedAt em ISO", async () => {
        mockedFetch.mockResolvedValue({ characters: [] });

        const result = await buildFacetextureExport();

        expect(result.version).toBe(1);
        expect(new Date(result.exportedAt).toISOString()).toBe(result.exportedAt);
    });
});

describe("exportFacetextureData", () => {
    it("dispara o download do JSON com o nome de arquivo esperado e retorna os dados", async () => {
        mockedFetch.mockResolvedValue({ characters: [buildCharacter({ name: "Alfa" })] });

        const result = await exportFacetextureData();

        expect(saveAs).toHaveBeenCalledTimes(1);
        const [blob, filename] = jest.mocked(saveAs).mock.calls[0];
        expect(filename).toBe(FACETEXTURE_EXPORT_FILENAME);
        expect(blob).toBeInstanceOf(Blob);
        expect((blob as Blob).type).toBe("application/json");
        expect(result.characters[0].name).toBe("Alfa");
    });
});
