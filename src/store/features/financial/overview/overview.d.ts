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
