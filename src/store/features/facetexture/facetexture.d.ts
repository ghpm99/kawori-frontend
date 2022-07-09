interface IFacetextureState {
	loading: boolean
	class: IClass[]
	facetexture: IFacetexture[]
	selected?: number
	backgroundUrl: string
    edited: boolean
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
	upload: boolean
}

interface IReorderCharacterAction {
	facetexture: IFacetexture
	newOrder: number
}

interface IUpdateFacetextureUrlAction {
	id: number
	image: string
	upload: boolean
}

interface IUpdateCharacterClassAction {
	id: number
	class: number
}

interface IUpdateCharacterShowClassAction {
	id: number
    show: boolean
}
