import Styles from './Characters.module.css'
import DragAndDropCharacters from './dragAndDrop'
import Info from './info'
import New from './new'

const Characters = () => {
    return (
        <div className={ Styles['characters'] }>
            <div>
                <h1>Personagens</h1>
                <DragAndDropCharacters />
                <New />
            </div>
            <Info />
        </div>
    )
}

export default Characters