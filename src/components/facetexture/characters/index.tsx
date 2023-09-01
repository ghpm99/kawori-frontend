import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
<<<<<<< HEAD
import { Tooltip, Typography } from 'antd'
import Styles from './Characters.module.scss'
import DragAndDropCharacters from './dragAndDrop'
import Info from './info'
import New from './new'

const { Title } = Typography
const Characters = () => {
=======
import { Button, Tooltip, Typography } from 'antd'
import { useSelector } from 'react-redux'
import { changeModalVisible } from 'store/features/facetexture'
import { RootState, useAppDispatch } from 'store/store'
import Styles from './Characters.module.scss'
import DragAndDropCharacters from './dragAndDrop'
import Info from './info'
import NewModal from './newModal'

const { Title } = Typography
const Characters = () => {
    const dispatch = useAppDispatch()
    const facetextureStore = useSelector((state: RootState) => state.facetexture)

    const toggleModalVisible = () => {
        dispatch(
            changeModalVisible({
                modal: 'newFacetexture',
                visible: !facetextureStore.modal.newFacetexture.visible,
            }),
        )
    }

    const disableNewButton = facetextureStore.facetexture.length >= 30

>>>>>>> dev
    return (
        <div className={Styles['characters']}>
            <div>
                <Title level={4}>
                    Personagens
                    <Tooltip
<<<<<<< HEAD
                        title='Organize seus personagens clicando no + para adicionar novo e clicando e arrastando para mudar a ordem.
                        Você também pode editar as informações do personagem clicando sobre a imagem.'
=======
                        showArrow
                        title="Organize seus personagens clicando em 'Incluir Novo Personagem' para adicionar novo e clicando e arrastando para mudar a ordem.
                        Você também pode editar as informações do personagem clicando sobre a imagem."
>>>>>>> dev
                    >
                        <FontAwesomeIcon icon={faCircleInfo} />
                    </Tooltip>
                </Title>
<<<<<<< HEAD
                <DragAndDropCharacters />
                <New />
            </div>
            <Info />
=======
                <Button type='primary' disabled={disableNewButton} onClick={() => toggleModalVisible()}>
                    Incluir Novo Personagem
                </Button>
                <DragAndDropCharacters />
            </div>
            <Info />
            <NewModal toggleVisible={toggleModalVisible} />
>>>>>>> dev
        </div>
    )
}

export default Characters
