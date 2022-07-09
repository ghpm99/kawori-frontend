import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useSelector } from 'react-redux'
import { reorderCharacterReducer, setSelectedFacetextureReducer } from '../../../../store/features/facetexture'
import { RootState, useAppDispatch } from '../../../../store/store'
import Styles from './DnDCharacters.module.css'

const DragAndDropCharacters = () => {

    const facetextureStore = useSelector((state: RootState) => state.facetexture)
    const dispatch = useAppDispatch()

    const reorderCharacter = async (facetexture: IFacetexture, newOrder: number) => {

        if (newOrder <= 0) {
            return
        }

        dispatch(reorderCharacterReducer({
            facetexture: facetexture,
            newOrder: newOrder
        }))
    }

    const onDragEnd = async (result, provider) => {

        if (!result.destination) {
            return
        }

        const indexSource = result.source.index + (parseInt(result.source.droppableId) * 7)
        const indexDestination = result.destination.index + (parseInt(result.destination.droppableId) * 7)
        const facetextureSource = facetextureStore.facetexture.find(item => item.order === indexSource)
        const facetextureDestination = facetextureStore.facetexture.find(item => item.order === indexDestination)

        reorderCharacter(facetextureSource, facetextureDestination.order)
    }

    const setSelectedCharacter = async (id) => {
        dispatch(setSelectedFacetextureReducer(id))
    }

    function listToMatrix(list, elementsPerSubArray) {
        var matrix = [], i, k

        for (i = 0, k = -1; i < list.length; i++) {
            if (i % elementsPerSubArray === 0) {
                k++;
                matrix[k] = []
            }
            matrix[k].push(list[i])
        }
        return matrix
    }

    const facetextureMatrix = listToMatrix(facetextureStore.facetexture, 7)

    return (
        <DragDropContext onDragEnd={ onDragEnd }>
            { facetextureMatrix.map((row, indexRow) => (
                <Droppable
                    key={ indexRow }
                    droppableId={ `${indexRow}` }
                    direction='horizontal'
                >
                    { (provided, snapshot) => (
                        <div
                            ref={ provided.innerRef }
                            className={ Styles['characters-container'] }
                            { ...provided.droppableProps }
                        >
                            { row.map((character, index) => (
                                <Draggable
                                    key={ character.id.toString() }
                                    draggableId={ character.id.toString() }
                                    index={ index }

                                >
                                    { (provided, snapshot) => (
                                        <div
                                            ref={ provided.innerRef }
                                            { ...provided.dragHandleProps }
                                            { ...provided.draggableProps }
                                            key={ character.id.toString() }
                                            className={ Styles['character'] }
                                            onClick={ (event) => setSelectedCharacter(character.id) }
                                        >
                                            {
                                                character.image &&
                                                <img
                                                    src={ character.image }
                                                    alt={ character.name }
                                                    width={ 125 }
                                                    height={ 160 }
                                                />
                                            }
                                        </div>
                                    ) }
                                </Draggable>
                            )) }
                            { provided.placeholder }
                        </div>
                    ) }
                </Droppable>
            )) }
        </DragDropContext>
    )
}

export default DragAndDropCharacters