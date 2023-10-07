interface IContractStore {
    data: IContractPagination[];
    loading: boolean;
    modal: IModalContracts;
    pagination: {
        currentPage: number;
        hasNext: boolean;
        hasPrevious: boolean;
        totalPages: number;
    };
    filters: IContractFilters;
}
