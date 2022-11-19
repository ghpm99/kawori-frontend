import { useEffect } from "react"
import { Bar } from 'react-chartjs-2'

import styles from './invoiceByTag.module.scss'

interface IInvoiceByTagProps {
    datasets: IInvoiceByTag[]
}

const InvoiceByTag = ({ datasets }: IInvoiceByTagProps) => {


    const dataset = datasets.map(item => ({
        label: item.name,
        data: [item.amount],
        backgroundColor: item.color
    }))

    console.log(dataset)

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Valores por tag',
            },
        },
    }

    const data = {
        labels: ['Tag'],
        datasets: dataset,
    }

    return (
        <div className={ styles['chart-container'] }>
            <Bar data={ data } options={ options } width={ 400 } height={ 200 } style={ { background: 'white' } } />
        </div>
    )
}

export default InvoiceByTag