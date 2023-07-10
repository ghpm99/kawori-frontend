import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
    ResponderProvided,
} from "react-beautiful-dnd";
import { useSelector } from "react-redux";

import {
    reorderCharacterReducer,
    setSelectedFacetextureReducer,
} from "../../../../store/features/facetexture";
import { RootState, useAppDispatch } from "../../../../store/store";
import Styles from "./DnDCharacters.module.scss";

const DragAndDropCharacters = () => {
    const facetextureStore = useSelector(
        (state: RootState) => state.facetexture,
    );
    const dispatch = useAppDispatch();

    const onDragEnd = async (
        result: DropResult,
        provided: ResponderProvided,
    ) => {
        if (!result.destination) {
            return;
        }

        const indexSource =
            result.source.index + parseInt(result.source.droppableId) * 7;
        const indexDestination =
            result.destination.index +
            parseInt(result.destination.droppableId) * 7;

        if (!indexDestination) {
            return;
        }

        dispatch(
            reorderCharacterReducer({
                indexSource,
                indexDestination,
            }),
        );
    };

    const setSelectedCharacter = (id: number) => {
        dispatch(setSelectedFacetextureReducer(id));
    };

    function listToMatrix(list: IFacetexture[], elementsPerSubArray: number) {
        var matrix = [],
            i,
            k;

        for (i = 0, k = -1; i < list.length; i++) {
            if (i % elementsPerSubArray === 0) {
                k++;
                const emptyArray: IFacetexture[] = [];
                matrix[k] = emptyArray;
            }
            matrix[k].push(list[i]);
        }
        return matrix;
    }

    const facetextureMatrix = listToMatrix(facetextureStore.facetexture, 7);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            {facetextureMatrix.map((row, indexRow) => (
                <Droppable
                    key={indexRow}
                    droppableId={`${indexRow}`}
                    direction="horizontal">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            className={Styles["characters-container"]}
                            {...provided.droppableProps}>
                            {row.map((character, index) => (
                                <Draggable
                                    key={`${indexRow}-${index}`}
                                    draggableId={`${indexRow}-${index}`}
                                    index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.dragHandleProps}
                                            {...provided.draggableProps}
                                            key={`${indexRow}-${index}`}
                                            className={Styles["character"]}
                                            onClick={(event) =>
                                                setSelectedCharacter(
                                                    indexRow * 7 + index,
                                                )
                                            }>
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
    );
};

export default DragAndDropCharacters;
