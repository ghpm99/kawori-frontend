import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAllContractService } from "services/financial";

const initialState: IContractStore = {
    data: [],
    loading: true,
    modal: {
        newPayment: {
            visible: false,
            error: false,
            errorMsg: "",
        },
    },
    filters: {
        page: 1,
        page_size: 20,
    },
    pagination: {
        currentPage: 1,
        hasNext: false,
        hasPrevious: false,
        totalPages: 1,
    },
};

export const fetchAllContract = createAsyncThunk("financial/fetchAllContract", async (filters: IContractFilters) => {
    const response = await fetchAllContractService(filters);
    return {
        filters,
        response,
    };
});

export const contractSlice = createSlice({
    name: "contract",
    initialState,
    reducers: {
        changeVisibleContractsModal: (
            state: IContractStore,
            action: PayloadAction<PayloadChangeVisibleModalContractsAction>,
        ) => {
            state.modal[action.payload.modal].visible = action.payload.visible;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllContract.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllContract.fulfilled, (state, action) => {
                state.data = action.payload.response.data.data;
                state.pagination = {
                    currentPage: action.payload.response.data.current_page,
                    hasNext: action.payload.response.data.has_next,
                    hasPrevious: action.payload.response.data.has_previous,
                    totalPages: action.payload.response.data.total_pages,
                };
                state.filters = action.payload.filters;
                state.loading = false;
            });
    },
});

export const { changeVisibleContractsModal } = contractSlice.actions;

export default contractSlice.reducer;
