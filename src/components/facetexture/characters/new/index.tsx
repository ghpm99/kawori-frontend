import { message } from 'antd'
import { useSelector } from 'react-redux'
import { includeNewCharacterReducer } from '../../../../store/features/facetexture'
import { RootState, useAppDispatch } from '../../../../store/store'
import Styles from './New.module.css'


const New = () => {

    const dispatch = useAppDispatch()
    const facetextureLength = useSelector((state: RootState) => state.facetexture.facetexture.length)

    const includeNewCharacteres = () => {
        if(facetextureLength >= 28){
            message.info('O maximo de personagens é 28')
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