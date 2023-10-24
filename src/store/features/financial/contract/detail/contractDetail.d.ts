interface IContractDetailStore {
    data: IContractDetail;
    invoices: IContractInvoicesDetail;
    contracts: IContractPagination[];
    loading: boolean;
    modal: IModalContract;
}

type PayloadChangeVisibleModalContractAction = {
    modal: keyof IModalContract;
    visible: boolean;
};

interface IModalContract {
    mergeContract: {
        id: number[];
        visible: boolean;
        error: boolean;
        errorMsg: string;
    };
    newInvoice: {
        visible: boolean;
        error: boolean;
        errorMsg: string;
    };
}
