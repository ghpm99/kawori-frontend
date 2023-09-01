<<<<<<< HEAD
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import { useSelector } from 'react-redux'

import { reorderCharacterReducer, setSelectedFacetextureReducer } from '../../../../store/features/facetexture'
import { RootState, useAppDispatch } from '../../../../store/store'
import Styles from './DnDCharacters.module.scss'
=======
import { DragDropContext, Draggable, Droppable, DropResult, ResponderProvided } from 'react-beautiful-dnd'
import { useSelector } from 'react-redux'

import { reorderCharacterThunk } from 'services/facetexture'
import { setSelectedFacetextureReducer } from '../../../../store/features/facetexture'
import { RootState, useAppDispatch } from '../../../../store/store'
import Styles from './DnDCharacters.module.scss'
import { message } from 'antd'
import { FACETEXTURE_MESSAGE_REF } from 'pages/admin/facetexture'
>>>>>>> dev

const DragAndDropCharacters = () => {
    const facetextureStore = useSelector((state: RootState) => state.facetexture)
    const dispatch = useAppDispatch()

<<<<<<< HEAD
    const onDragEnd = async (result: DropResult) => {
=======
    const onDragEnd = async (result: DropResult, provided: ResponderProvided) => {
>>>>>>> dev
        if (!result.destination) {
            return
        }

<<<<<<< HEAD
        const indexSource = result.source.index + parseInt(result.source.droppableId) * 7
        const indexDestination = result.destination.index + parseInt(result.destination.droppableId) * 7

        if (!indexDestination) {
            return
        }

        dispatch(
            reorderCharacterReducer({
                indexSource,
                indexDestination,
            }),
        )
=======
        const indexDestination = result.destination.index
        const facetextureSource = facetextureStore.facetexture.find(
            (facetexture) => facetexture.id === parseInt(result.draggableId),
        )

        if (!indexDestination || !facetextureSource) {
            return
        }

        message.loading({
            content: 'Alterando ordem',
            key: FACETEXTURE_MESSAGE_REF,
        })

        dispatch(
            reorderCharacterThunk({
                id: facetextureSource.id,
                indexDestination,
            }),
        )
            .then((value) => {
                if (value.type.includes('fulfilled')) {
                    message.success({
                        content: 'Ordem alterada com sucesso!',
                        key: FACETEXTURE_MESSAGE_REF,
                    })
                }
            })
            .catch((e) => {
                message.error({
                    content: 'Falhou em alterar ordem!',
                    key: FACETEXTURE_MESSAGE_REF,
                })
            })
>>>>>>> dev
    }

    const setSelectedCharacter = (id: number) => {
        dispatch(setSelectedFacetextureReducer(id))
    }

    function listToMatrix(list: IFacetexture[], elementsPerSubArray: number) {
<<<<<<< HEAD
        const matrix = []
        let i = 0,
            k = 0
=======
        var matrix = [],
            i,
            k
>>>>>>> dev

        for (i = 0, k = -1; i < list.length; i++) {
            if (i % elementsPerSubArray === 0) {
                k++
                const emptyArray: IFacetexture[] = []
                matrix[k] = emptyArray
            }
            matrix[k].push(list[i])
        }
        return matrix
    }

    const facetextureMatrix = listToMatrix(facetextureStore.facetexture, 7)

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            {facetextureMatrix.map((row, indexRow) => (
                <Droppable key={indexRow} droppableId={`${indexRow}`} direction='horizontal'>
<<<<<<< HEAD
                    {(provided) => (
=======
                    {(provided, snapshot) => (
>>>>>>> dev
                        <div
                            ref={provided.innerRef}
                            className={Styles['characters-container']}
                            {...provided.droppableProps}
                        >
                            {row.map((character, index) => (
<<<<<<< HEAD
                                <Draggable
                                    key={`${indexRow}-${index}`}
                                    draggableId={`${indexRow}-${index}`}
                                    index={index}
                                >
                                    {(provided) => (
=======
                                <Draggable key={character.id} draggableId={`${character.id}`} index={character.order}>
                                    {(provided, snapshot) => (
>>>>>>> dev
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.dragHandleProps}
                                            {...provided.draggableProps}
                                            key={`${indexRow}-${index}`}
                                            className={Styles['character']}
<<<<<<< HEAD
                                            onClick={() => setSelectedCharacter(indexRow * 7 + index)}
=======
                                            onClick={(event) => setSelectedCharacter(character.id)}
>>>>>>> dev
                                        >
                                            {character.image && (
                                                <img
                                                    src={character.image}
                                                    alt={character.name}
                                                    width={125}
                                                    height={160}
                                                />
                                            )}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            ))}
        </DragDropContext>
    )
}

export default DragAndDropCharacters
