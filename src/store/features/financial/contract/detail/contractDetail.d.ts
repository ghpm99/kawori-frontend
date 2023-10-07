interface IContractDetailStore {
    data: IContractDetail;
        invoices: IContractInvoicesDetail;
        contracts: IContractPagination[];
        loading: boolean;
        modal: IModalContract;
}