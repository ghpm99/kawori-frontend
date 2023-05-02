import { Line } from 'react-chartjs-2'

import { formatterMonthYearDate } from '../../../util'
import styles from './paymentWithFixed.module.scss'

interface IPaymentWithFixedProps {
    data: IPaymentCharts[]
}

export default function PaymentWithFixed(props: IPaymentWithFixedProps) {

    const options = {
        responsive: true,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        stacked: false,
        plugins: {
            title: {
                display: true,
                text: 'Relatorio pagamentos',
            },
        },
        scales: {
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
            }
        },
    }

    const valueDifWithFixed = props.data.map((payment, index) => payment.credit - payment.debit)

    const data = {
        labels: props.data.map(data => formatterMonthYearDate(data.label)),
        datasets: [
            {
                label: 'Credito',
                data: props.data.map(data => data.credit),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                lineTension: 0.3,
            },
            {
                label: 'Debito',
                data:  props.data.map(data => data.debit),
                borderColor: '#820000',
                backgroundColor: '#8200007f',
                lineTension: 0.3,
            },
            {
                label: 'Diferença',
                data: valueDifWithFixed,
                borderColor: '#048200',
                backgroundColor: '#04820073',
                lineTension: 0.3,
            }
        ],
    }

    return (
        <div className={ styles['chart-container'] }>
            <Line data={ data } options={ options } width={ 400 } height={ 200 } style={ { background: 'white' } } />
        </div>
    )
}