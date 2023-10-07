interface IOverviewStore {
    loading: boolean;
    data: {
        payments: IPaymentCharts[];
        open: IPaymentReportOpen[];
        closed: IPaymentReportClosed[];
        fixed_debit: number;
        fixed_credit: number;
        invoiceByTag: IInvoiceByTag[];
        countPayment: number;
        amountPayment: number;
        amountPaymentOpen: number;
        amountPaymentClosed: number;
    };
}
