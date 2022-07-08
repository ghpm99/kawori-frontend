
interface IFacetextureState {
    loading: boolean
    class: IClass[]
    facetexture: IFacetexture[]
    selected?: number
    backgroundUrl: string
}

interface IClass {
    id: number
    name: string
    abbreviation: string
    class_image: string
}

interface IFacetexture {
    id: number
    name: string
    class: {
        id: number
        name: string
        abbreviation: string
        class_image: string
    }
    show: boolean
    order: number
    image: string
}

interface IReorderCharacterAction {
    facetexture: IFacetexture
    newOrder: number
}