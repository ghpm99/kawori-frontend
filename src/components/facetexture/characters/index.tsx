import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tooltip, Typography } from 'antd'
import Styles from './Characters.module.css'
import DragAndDropCharacters from './dragAndDrop'
import Info from './info'
import New from './new'

const { Title } = Typography
const Characters = () => {
    return (
        <div className={ Styles['characters'] }>
            <div>
                <Title level={ 4 }>
                    Personagens
                    <Tooltip title='Organize seus personagens clicando no + para adicionar novo e clicando e arrastando para mudar a ordem.
                        Você também pode editar as informações do personagem clicando sobre a imagem.'>
                        <FontAwesomeIcon icon={ faCircleInfo } />
                    </Tooltip>
                </Title>
                <DragAndDropCharacters />
                <New />
            </div>
            <Info />
        </div>
    )
}

export default Characters