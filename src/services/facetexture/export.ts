import { saveAs } from "file-saver";

import { db } from "@/util/db";
import { fetchFacetextureService } from ".";

export interface FacetextureExportCharacter {
    name: string;
    classId: number | null;
    classAbbreviation: string;
    order: number;
    show: boolean;
    image: string | null;
}

export interface FacetextureExportV1 {
    version: 1;
    exportedAt: string;
    characters: FacetextureExportCharacter[];
    background: string | null;
}

export const FACETEXTURE_EXPORT_FILENAME = "kawori-facetexture-export.json";

const blobToDataUrl = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });

export async function buildFacetextureExport(): Promise<FacetextureExportV1> {
    const { characters } = await fetchFacetextureService();

    const orderedCharacters = [...characters].sort((a, b) => a.order - b.order);

    const exportedCharacters = await Promise.all(
        orderedCharacters.map<Promise<FacetextureExportCharacter>>(async (character) => {
            const storedImage = await db.image.where("name").equals(character.name).first();
            return {
                name: character.name,
                classId: character.class?.id ?? null,
                classAbbreviation: character.class?.abbreviation ?? "",
                order: character.order,
                show: character.show,
                image: storedImage ? await blobToDataUrl(storedImage.imagem) : null,
            };
        }),
    );

    const storedBackground = (await db.background.toArray())[0];

    return {
        version: 1,
        exportedAt: new Date().toISOString(),
        characters: exportedCharacters,
        background: storedBackground ? await blobToDataUrl(storedBackground.image) : null,
    };
}

export async function exportFacetextureData(): Promise<FacetextureExportV1> {
    const data = await buildFacetextureExport();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    saveAs(blob, FACETEXTURE_EXPORT_FILENAME);
    return data;
}
