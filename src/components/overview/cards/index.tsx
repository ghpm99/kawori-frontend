import { Card } from 'antd'

import { formatMoney } from '../../../util'
import styles from './cards.module.scss'


const Cards = (props: IPaymentReportCards) => {

    return (
        <div className={ styles['cards-container'] }>
            <Card
                title='Total de pagamentos'
                style={ { flexGrow: '1' } }
                loading={props.countPayment.loading}
            >
                { props.countPayment.value }
            </Card>
            <Card
                title='Valor total de pagamentos'
                style={ { flexGrow: '1' } }
                loading={props.amountPayment.loading}
            >
                { formatMoney(props.amountPayment.value) }
            </Card>
            <Card
                title='Valor total de pagamentos em aberto'
                style={ { flexGrow: '1' } }
                loading={props.amountPaymentOpen.loading}
            >
                { formatMoney(props.amountPaymentOpen.value) }
            </Card>
            <Card
                title='Valor total de pagamentos fechados'
                style={ { flexGrow: '1' } }
                loading={props.amountPaymentClosed.loading}
            >
                { formatMoney(props.amountPaymentClosed.value) }
            </Card>
        </div>
    )
}

export default Cards