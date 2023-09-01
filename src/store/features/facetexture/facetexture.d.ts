interface IFacetextureState {
    loading: boolean
    class: IClass[]
    facetexture: IFacetexture[]
    selected?: number
    backgroundUrl: string
    edited: boolean
    error: boolean
<<<<<<< HEAD
=======
    modal: IFacetextureModalState
>>>>>>> dev
}

interface IClass {
    id: number
    name: string
    abbreviation: string
    class_image: string
}

interface IFacetexture {
<<<<<<< HEAD
=======
    id: number
>>>>>>> dev
    name: string
    class: {
        id: number
        name: string
        abbreviation: string
        class_image: string
    }
    show: boolean
    image: string
<<<<<<< HEAD
=======
    order: number
}

interface IFacetextureModalState {
    newFacetexture: INewFacetextureModal
}

interface INewFacetextureModal {
    visible: boolean
    saving: boolean
    data: INewFacetextureData
}

interface INewFacetextureData {
    name: string
    classId: number
    visible: boolean
>>>>>>> dev
}

interface IReorderCharacterAction {
    indexSource: number
    indexDestination: number
}

interface IUpdateFacetextureUrlAction {
<<<<<<< HEAD
    index: number
=======
    id: number
>>>>>>> dev
    image: string
}

interface IUpdateCharacterClassAction {
<<<<<<< HEAD
    index: number
    class: number
}

interface IUpdateCharacterShowClassAction {
    index: number
    show: boolean
}

interface IUpdateCharacterImageNameAction {
    index: number
    name: string
}
=======
    classId: number
}

interface IUpdateCharacterVisibleClassAction {
    visible: boolean
}

interface IUpdateCharacterImageNameAction {
    name: string
}

type changeModalVisible = {
    modal: keyof IFacetextureModalState
    visible: boolean
}
>>>>>>> dev
