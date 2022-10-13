import React from 'react'
import { Bar } from 'react-chartjs-2'

import styles from './paymentFixed.module.scss'

interface IPaymentFixedProps {
    fixedCredit: number
    fixedDebit: number
}

export default function PaymentFixed(props: IPaymentFixedProps) {

    const labels = ['Ativo']

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Relatorio pagamentos mensais',
            },
        },
    }

    const data = {
        labels,
        datasets: [
            {
                label: 'Credito',
                data: [props.fixedCredit],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'Debito',
                data: [props.fixedDebit],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    }

    return (
        <div className={ styles['chart-container'] }>
            <Bar data={ data } options={ options } width={ 400 } height={ 200 } style={{background: 'white'}}/>
        </div>
    )
}