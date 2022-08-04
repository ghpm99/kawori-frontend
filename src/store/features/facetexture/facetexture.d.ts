interface IFacetextureState {
	loading: boolean
	class: IClass[]
	facetexture: IFacetexture[]
	selected?: number
	backgroundUrl: string
    edited: boolean
	error: boolean
}

interface IClass {
	id: number
	name: string
	abbreviation: string
	class_image: string
}

interface IFacetexture {
	name: string
	class: {
		id: number
		name: string
		abbreviation: string
		class_image: string
	}
	show: boolean
	image: string
	upload: boolean
}

interface IReorderCharacterAction {
	indexSource: number
	indexDestination: number
}

interface IUpdateFacetextureUrlAction {
	index: number
	image: string
	upload: boolean
}

interface IUpdateCharacterClassAction {
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