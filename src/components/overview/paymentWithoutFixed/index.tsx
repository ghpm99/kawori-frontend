import React from 'react'
import { Line } from 'react-chartjs-2'

export default function PaymentWithoutFixed(props) {

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
                text: 'Relatorio pagamentos abertos sem mensalidades',
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

    const data = {
        labels: props.payments.map(data => data.label),
        datasets: [
            {
                label: 'Credito',
                data: props.payments.map(data => data.credit),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'Debito',
                data: props.payments.map(data => data.debit),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    }

    return (
        <>
            <Line data={ data } options={ options } width={ 400 } height={ 200 } />
        </>
    )
}