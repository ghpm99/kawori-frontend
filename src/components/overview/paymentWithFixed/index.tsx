import { Line } from 'react-chartjs-2'

import styles from './paymentWithFixed.module.scss'

interface IPaymentWithFixedProps {
    data: {
        open: IPaymentReportOpen[]
        closed: IPaymentReportClosed[]
        fixed_debit: number
        fixed_credit: number
    }
}

interface IPaymentReport {
    debit: number
    credit: number
    openDebit: number
    openCredit: number
    fixedCredit: number
    fixedDebit: number
    fixed_credit_open: number
    fixed_debit_open: number
    closedDebit: number
    closedCredit: number
    label: string
}

export default function PaymentWithFixed(props: IPaymentWithFixedProps) {

    let allPayments: IPaymentReport[] = []

    props.data.closed?.forEach(payment => {
        allPayments.push({
            ...payment,
            closedDebit: payment.debit,
            closedCredit: payment.credit,
            openDebit: 0,
            openCredit: 0,
            fixedCredit: 0,
            fixedDebit: 0,
            fixed_credit_open: 0,
            fixed_debit_open: 0
        })
    })

    props.data.open?.forEach(payment => {

        const duplicatePayments = allPayments.filter(allPayment => allPayment.label === payment.label)

        if (duplicatePayments.length > 0) {
            const totalDebitDuplicate = duplicatePayments.reduce((previous, current) => {
                const newPayment = {
                    ...current,
                    debit: previous.debit + current.debit,
                    credit: previous.credit + current.credit,
                    closedDebit: previous.closedDebit + current.closedDebit,
                    closedCredit: previous.closedCredit + current.closedCredit,
                }
                return newPayment
            })

            allPayments = allPayments.filter(allPayment => allPayment.label !== payment.label)

            const newPayment = {
                ...totalDebitDuplicate,
                debit: payment.debit + totalDebitDuplicate.debit,
                credit: payment.credit + totalDebitDuplicate.credit,
                openDebit: payment.debit,
                openCredit: payment.credit,
                fixedCredit: props.data.fixed_credit,
                fixedDebit: props.data.fixed_debit,
                fixed_credit_open: payment.fixed_credit_open,
                fixed_debit_open: payment.fixed_debit_open
            }

            allPayments.push(newPayment)
        } else {
            allPayments.push({
                ...payment,
                credit: payment.credit + props.data.fixed_credit,
                debit: payment.debit + props.data.fixed_debit,
                openDebit: payment.debit,
                openCredit: payment.credit,
                fixedCredit: props.data.fixed_credit,
                fixedDebit: props.data.fixed_debit,
                closedDebit: 0,
                closedCredit: 0,
            })
        }
    })

    const calculatePaymentValue = (valueFixed: number, valueFixedOpen: number, valueClosed: number, valueOpen: number) => {
        if (valueClosed == 0) {
            return valueFixed + valueOpen
        }
        const valueFixedClosed = valueFixed - valueFixedOpen
        const valueClosedWithoutFixed = valueClosed - valueFixedClosed
        const value = valueOpen + valueClosedWithoutFixed + valueFixed

        return value
    }

    allPayments = allPayments.map(payment => ({
        ...payment,
        debit: calculatePaymentValue(
            payment.fixedDebit,
            payment.fixed_debit_open,
            payment.closedDebit,
            payment.openDebit
        ),
        credit: calculatePaymentValue(
            payment.fixedCredit,
            payment.fixed_credit_open,
            payment.closedCredit,
            payment.openCredit
        ),
    }))

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

    const valueDifWithFixed = allPayments.map((payment, index) => payment.credit - payment.debit)

    const data = {
        labels: allPayments.map(data => data.label),
        datasets: [
            {
                label: 'Credito',
                data: allPayments.map(data => data.credit),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                lineTension: 0.3,
            },
            {
                label: 'Debito',
                data: allPayments.map(data => data.debit),
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