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
    order: number;
}

export async function fetchFacetextureService() {
    const response = await apiDjango.get("/facetexture/");
    return response.data as IFacetextureApi;
}

export async function fetchFaceTextureClassService() {
    const response = await apiDjango.get("/facetexture/class");
    return response.data;
}

interface IFacetextureBackgroundArgs {
    background: Blob;
    icon_style: string;
}

// The backend reads `background` from request.FILES and the rest from
// request.POST, so the payload must be real multipart/form-data — a plain object
// would be serialized as JSON and the file would never reach the server. A Blob
// needs an explicit filename for Django to treat it as an uploaded file.
function buildBackgroundFormData(args: IFacetextureBackgroundArgs): FormData {
    const formData = new FormData();
    formData.append("background", args.background, "background.png");
    formData.append("icon_style", args.icon_style);
    return formData;
}

export async function previewFacetextureService(args: IFacetextureBackgroundArgs) {
    const response = await apiDjango.post("/facetexture/preview", buildBackgroundFormData(args), {
        responseType: "blob",
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

export async function downloadFacetextureService(args: IFacetextureBackgroundArgs) {
    const response = await apiDjango.post("/facetexture/download", buildBackgroundFormData(args), {
        responseType: "blob",
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

export const newCharacterThunk = createAsyncThunk(
    "facetexture/NewCharacter",
    async (facetexture: INewFacetextureData) => {
        const response = await apiDjango.post("facetexture/new", facetexture);
        const data = await response.data;
        return data;
    },
);

export const reorderCharacterThunk = createAsyncThunk(
    "facetexture/reorderCharacter",
    async ({ id, indexDestination }: { id: number; indexDestination: number }) => {
        const response = await apiDjango.post(`facetexture/${id}/reorder`, {
            index_destination: indexDestination,
        });
        const data = await response.data;
        return data;
    },
);

export const changeClassCharacterThunk = createAsyncThunk(
    "facetexture/changeClassCharacter",
    async ({ id, classId }: { id: number; classId: number }) => {
        const response = await apiDjango.post(`facetexture/${id}/change-class`, {
            new_class: classId,
        });
        const data = await response.data;
        return {
            data,
            id,
        };
    },
);

export const changeCharacterNameThunk = createAsyncThunk(
    "facetexture/changeCharacterName",
    async ({ id, name }: { id: number; name: string }) => {
        const response = await apiDjango.post(`facetexture/${id}/change-name`, {
            name: name,
        });
        const data = await response.data;
        return {
            data,
            id,
        };
    },
);

export const changeShowClassThunk = createAsyncThunk(
    "facetexture/changeShowClass",
    async ({ id, visible }: { id: number; visible: boolean }) => {
        const response = await apiDjango.post(`facetexture/${id}/change-visible`, {
            show: visible,
        });
        const data = await response.data;
        return {
            data,
            id,
            visible,
        };
    },
);

export const deleteCharacterThunk = createAsyncThunk("facetexture/deleteCharacter", async (id: number) => {
    const response = await apiDjango.post(`facetexture/${id}/delete`);
    const data = await response.data;
    return {
        data,
        id,
    };
});
