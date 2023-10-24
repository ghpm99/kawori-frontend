interface IOverviewStore {
    loading: boolean;
    data: {
        payments: IPaymentCharts[];
        fixed_debit: number;
        fixed_credit: number;
        invoiceByTag: IInvoiceByTag[];
        countPayment: number;
        amountPayment: number;
        amountPaymentOpen: number;
        amountPaymentClosed: number;
        amountForecastValue: number;
    };
}

interface IPaymentCharts {
    label: string;
    debit: number;
    credit: number;
    total: number;
    difference: number;
    accumulated: number;
}

interface IInvoiceByTag {
    id: number;
    name: string;
    color: string;
    amount: number;
}
