import { message } from 'antd'
import { useSelector } from 'react-redux'
import { includeNewCharacterReducer } from '../../../../store/features/facetexture'
import { RootState, useAppDispatch } from '../../../../store/store'
import Styles from './New.module.scss'


const New = () => {

    const dispatch = useAppDispatch()
    const facetextureLength = useSelector((state: RootState) => state.facetexture.facetexture.length)

    const includeNewCharacteres = () => {
        if(facetextureLength >= 29){
            message.info('O maximo de personagens é 29')
            return
        }
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