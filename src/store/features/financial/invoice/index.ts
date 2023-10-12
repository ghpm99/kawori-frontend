import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAllInvoiceService } from "services/financial";

const initialState: IInvoiceStore = {
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

export const fetchAllInvoice = createAsyncThunk("financial/fetchAllInvoice", async (filters: IInvoiceFilters) => {
    const response = await fetchAllInvoiceService(filters);
    return {
        filters,
        response,
    };
});

export const financialSlice = createSlice({
    name: "financial",
    initialState,
    reducers: {
        changeVisibleInvoiceModal: (
            state: IInvoiceStore,
            action: PayloadAction<PayloadChangeVisibleModalInvoiceAction>,
        ) => {
            state.modal[action.payload.modal].visible = action.payload.visible;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllInvoice.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllInvoice.fulfilled, (state, action) => {
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

export const { changeVisibleInvoiceModal } = financialSlice.actions;

export default financialSlice.reducer;
