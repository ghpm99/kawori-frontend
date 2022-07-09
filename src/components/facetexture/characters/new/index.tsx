import { includeNewCharacterReducer } from '../../../../store/features/facetexture'
import { useAppDispatch } from '../../../../store/store'
import Styles from './New.module.css'


const New = () => {

    const dispatch = useAppDispatch()

    const includeNewCharacteres = () => {
        dispatch(includeNewCharacterReducer())
    }

    return (
        <div
            className={ Styles['include-characters'] }
            onClick={ includeNewCharacteres }
        >
            +
        </div>
    )
}

export default New