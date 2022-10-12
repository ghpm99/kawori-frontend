import { Card } from 'antd'

import styles from './cards.module.scss'

const Cards = () => {

    return (
        <div className={ styles['cards-container'] }>
            <Card
                title='Total de pagamentos'
                style={ { flexGrow: '1' } }
            >
                0
            </Card>
            <Card
                title='Valor total de pagamentos'
                style={ { flexGrow: '1' } }
            >
                0
            </Card>
        </div>
    )
}

export default Cards