import { apiDjango } from ".."

interface IFacetextureApi {
    characters: IFacetextureCharacterApi[];
}

export interface IFacetextureCharacterApi {
    name: string;
    class: {
        id: number;
        name: string;
        abbreviation: string;
        class_image: string;
    };
    show: boolean;
    image: any;
}

export async function fetchFacetextureService() {
    const response = await apiDjango.get("/facetexture/");
    return response.data as IFacetextureApi;
}

export async function updateFacetextureService(
    characters: updateFacetexturePayload,
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
        },
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
        },
    );
    return response.data;
}
