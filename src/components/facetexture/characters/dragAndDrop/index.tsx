import { DragDropContext, Draggable, Droppable, DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';

import { reorderCharacterThunk } from 'services/facetexture';
import { setSelectedFacetextureReducer } from '../../../../store/features/facetexture';
import { RootState, useAppDispatch } from '../../../../store/store';
import Styles from './DnDCharacters.module.scss';

const DragAndDropCharacters = () => {

    const facetextureStore = useSelector((state: RootState) => state.facetexture)
    const dispatch = useAppDispatch()

    const onDragEnd = async (result: DropResult, provided: ResponderProvided) => {
        console.log(result)
        if (!result.destination) {
            return
        }

        const indexDestination = result.destination.index
        const facetextureSource = facetextureStore.facetexture.find(facetexture => facetexture.id === parseInt(result.draggableId))

        if (!indexDestination || !facetextureSource) {
            return
        }

        dispatch(reorderCharacterThunk({
            id: facetextureSource.id,
            indexDestination
        }))

    }

    const setSelectedCharacter = (id: number) => {
        dispatch(setSelectedFacetextureReducer(id))
    }

    function listToMatrix(list: IFacetexture[], elementsPerSubArray: number) {
        var matrix = [], i, k

        for (i = 0, k = -1; i < list.length; i++) {
            if (i % elementsPerSubArray === 0) {
                k++;
                const emptyArray: IFacetexture[] = []
                matrix[k] = emptyArray
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
                                    key={character.id }
                                    draggableId={ `${character.id}` }
                                    index={ character.order }

                                >
                                    { (provided, snapshot) => (
                                        <div
                                            ref={ provided.innerRef }
                                            { ...provided.dragHandleProps }
                                            { ...provided.draggableProps }
                                            key={ `${indexRow}-${index}` }
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