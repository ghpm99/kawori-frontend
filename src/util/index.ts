
export const formatMoney = (
    amount,
    decimalCount = 2,
    decimal = '.',
    thousands = ',',
    currencySymbol = 'R$',
) => {
    if (typeof Intl === 'object') {
        return new Intl.NumberFormat('pt-br', {
            style: 'currency',
            currency: 'BRL',
        }).format(amount)
    }
    // Fallback if Intl is not present.
    try {
        const negativeSign = amount < 0 ? '-' : ''
        const amountNumber = Math.abs(Number(amount) || 0).toFixed(decimalCount)
        const i = parseInt(amountNumber, 10).toString()
        const j = i.length > 3 ? i.length % 3 : 0
        return (
            currencySymbol +
            negativeSign +
            (j ? i.substr(0, j) + thousands : '') +
            i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${thousands}`) +
            (decimalCount
                ? decimal +
                Math.abs(parseInt(amountNumber) - parseInt(i))
                    .toFixed(decimalCount)
                    .slice(2)
                : '')
        )
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
    }
    return amount
}