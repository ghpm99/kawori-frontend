import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiDjango } from "..";

interface IFacetextureApi {
    characters: IFacetextureCharacterApi[];
}

export interface IFacetextureCharacterApi {
    id: number;
    name: string;
    class: {
        id: number;
        name: string;
        abbreviation: string;
        class_image: string;
    };
    show: boolean;
    image: {};
}

export async function fetchFacetextureService() {
    const response = await apiDjango.get("/facetexture/");
    return response.data as IFacetextureApi;
}

export async function updateFacetextureService(
    characters: updateFacetexturePayload
) {
    const response = await apiDjango.post("/facetexture/save", characters);
    return response.data;
}

export async function fetchFaceTextureClassService() {
    const response = await apiDjango.get("/facetexture/class");
    return response.data;
}

export async function previewFacetextureService(args: any) {
    const response = await apiDjango.post(
        "/facetexture/preview",
        { ...args },
        {
            responseType: "blob",
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
}

export async function downloadFacetextureService(args: any) {
    const response = await apiDjango.post(
        "/facetexture/download",
        { ...args },
        {
            responseType: "blob",
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
}

export const reorderCharacter = createAsyncThunk(
    "facetexture/reorderCharacter",
    async ({
        facetextureId,
        indexDestination,
    }: {
        facetextureId: number;
        indexDestination: number;
    }) => {
        const response = await apiDjango.post("facetexture/reorder", {
            facetexture_id: facetextureId,
            index_destination: indexDestination,
        });
        const data = await response.data;
        return data;
    }
);

export const changeClassCharacter = createAsyncThunk(
    "facetexture/changeClassCharacter",
    async ({
        facetextureID,
        classId,
    }: {
        facetextureID: number;
        classId: number;
    }) => {
        const response = await apiDjango.post("facetexture/change-class", {
            character_id: facetextureID,
            new_class: classId,
        });
        const data = await response.data;
        return {
            data,
            facetextureID
        };
    }
);

export const newCharacter = createAsyncThunk(
    "facetexture/NewCharacter",
    async () => {
        const response = await apiDjango.post("facetexture/new")
        const data = await response.data
        return data
    }
)
