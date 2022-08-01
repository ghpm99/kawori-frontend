import { Line } from 'react-chartjs-2'

export default function PaymentWithFixed(props) {

    let allPayments = []

    props.data.closed.forEach(payment => {
        allPayments.push({
            ...payment,
            closedDebit: payment.debit,
            closedCredit: payment.credit,
            openDebit: 0,
            openCredit: 0,
            fixedCredit: 0,
            fixedDebit: 0
        })
    })

    props.data.open.forEach(payment => {

        const duplicatePayments = allPayments.filter(allPayment => allPayment.label === payment.label)

        if (duplicatePayments.length > 0) {
            const totalDebitDuplicate = duplicatePayments.reduce((previous, current) => {
                const newPayment = {
                    ...current,
                    debit: parseFloat(previous.debit ?? 0) + parseFloat(current.debit ?? 0),
                    credit: parseFloat(previous.credit ?? 0) + parseFloat(current.credit ?? 0),
                    closedDebit: parseFloat(previous.closedDebit ?? 0) + parseFloat(current.closedDebit ?? 0),
                    closedCredit: parseFloat(previous.closedCredit ?? 0) + parseFloat(current.closedCredit ?? 0),
                }
                return newPayment
            })

            allPayments = allPayments.filter(allPayment => allPayment.label !== payment.label)

            const newPayment = {
                ...totalDebitDuplicate,
                debit: parseFloat(payment.debit ?? 0) + parseFloat(totalDebitDuplicate.debit ?? 0),
                credit: parseFloat(payment.credit ?? 0) + parseFloat(totalDebitDuplicate.credit ?? 0),
                openDebit: payment.debit,
                openCredit: payment.credit,
                fixedCredit: parseFloat(props.data.fixed_credit[0] ?? 0),
                fixedDebit: parseFloat(props.data.fixed_debit[0] ?? 0),
                fixed_credit_open: payment.fixed_credit_open,
                fixed_debit_open: payment.fixed_debit_open
            }

            allPayments.push(newPayment)
        } else {
            allPayments.push({
                ...payment,
                credit: parseFloat(payment.credit ?? 0) + parseFloat(props.data.fixed_credit[0] ?? 0),
                debit: parseFloat(payment.debit ?? 0) + parseFloat(props.data.fixed_debit[0] ?? 0),
                openDebit: payment.debit,
                openCredit: payment.credit,
                fixedCredit: parseFloat(props.data.fixed_credit[0] ?? 0),
                fixedDebit: parseFloat(props.data.fixed_debit[0] ?? 0),
                closedDebit: 0,
                closedCredit: 0,
            })
        }
    })

    const calculatePaymentValue = (valueFixed, valueFixedOpen, valueClosed, valueOpen) => {
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
            parseFloat(payment.fixedDebit ?? 0),
            parseFloat(payment.fixed_debit_open ?? 0),
            parseFloat(payment.closedDebit ?? 0),
            parseFloat(payment.openDebit ?? 0)
        ),
        credit: calculatePaymentValue(
            parseFloat(payment.fixedCredit ?? 0),
            parseFloat(payment.fixed_credit_open ?? 0),
            parseFloat(payment.closedCredit ?? 0),
            parseFloat(payment.openCredit ?? 0)
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
            },
            {
                label: 'Debito',
                data: allPayments.map(data => data.debit),
                borderColor: '#820000',
                backgroundColor: '#8200007f',
            },
            {
                label: 'Diferença',
                data: valueDifWithFixed,
                borderColor: '#048200',
                backgroundColor: '#04820073',
            }
        ],
    }

    return (
        <Line data={ data } options={ options } width={ 400 } height={ 200 } />
    )
}