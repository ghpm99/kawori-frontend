jest.mock("axios", () => {
    const actual = jest.requireActual("axios");
    return {
        ...actual,
        create: jest.fn(() => ({
            get: jest.fn(),
            post: jest.fn(),
            interceptors: {
                request: { use: jest.fn() },
                response: { use: jest.fn() },
            },
        })),
    };
});

import { apiDjango } from "..";
import {
    fetchAllPaymentService,
    saveNewPaymentService,
    fetchDetailPaymentService,
    savePaymentDetailService,
    payoffPaymentService,
    fetchPaymentReportService,
    fetchCountPaymentReportService,
    fetchAmountPaymentReportService,
    fetchAmountPaymentOpenReportService,
    fetchAmountPaymentClosedReportService,
    fetchAmountInvoiceByTagReportService,
    fetchAllContractService,
    fetchAllInvoiceService,
    saveNewContractService,
    fetchDetailContractService,
    fetchDetailContractInvoicesService,
    includeNewInvoiceService,
    fetchDetailInvoiceService,
    fetchDetailInvoicePaymentsService,
    mergeContractService,
    fetchTagsService,
    includeNewTagService,
    saveInvoiceTagsService,
    updateAllContractsValue,
} from "./index";

const mockedGet = apiDjango.get as jest.MockedFunction<typeof apiDjango.get>;
const mockedPost = apiDjango.post as jest.MockedFunction<typeof apiDjango.post>;

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Payment services", () => {
    it("fetchAllPaymentService deve chamar GET /financial/payment/ com filtros", async () => {
        const filters = { page: 1, status: "open" } as any;
        mockedGet.mockResolvedValueOnce({ data: { results: [] } } as any);

        await fetchAllPaymentService(filters);

        expect(mockedGet).toHaveBeenCalledWith("/financial/payment/", { params: filters });
    });

    it("saveNewPaymentService deve chamar POST /financial/payment/new com dados", async () => {
        const data = { value: 100, date: "2024-01-01" } as any;
        mockedPost.mockResolvedValueOnce({ data: { id: 1 } } as any);

        await saveNewPaymentService(data);

        expect(mockedPost).toHaveBeenCalledWith("/financial/payment/new", data);
    });

    it("fetchDetailPaymentService deve chamar GET /financial/payment/:id/", async () => {
        mockedGet.mockResolvedValueOnce({ data: { id: 5 } } as any);

        await fetchDetailPaymentService(5);

        expect(mockedGet).toHaveBeenCalledWith("/financial/payment/5/");
    });

    it("savePaymentDetailService deve chamar POST /financial/payment/:id/save", async () => {
        const payment = { value: 200 } as any;
        mockedPost.mockResolvedValueOnce({ data: {} } as any);

        await savePaymentDetailService(10, payment);

        expect(mockedPost).toHaveBeenCalledWith("/financial/payment/10/save", payment);
    });

    it("payoffPaymentService deve chamar POST /financial/payment/:id/payoff", async () => {
        mockedPost.mockResolvedValueOnce({ data: {} } as any);

        await payoffPaymentService(7);

        expect(mockedPost).toHaveBeenCalledWith("/financial/payment/7/payoff");
    });
});

describe("Report services", () => {
    it("fetchPaymentReportService deve chamar GET /financial/report/", async () => {
        mockedGet.mockResolvedValueOnce({ data: {} } as any);

        await fetchPaymentReportService();

        expect(mockedGet).toHaveBeenCalledWith("/financial/report/");
    });

    it("fetchCountPaymentReportService deve chamar GET /financial/report/count_payment", async () => {
        mockedGet.mockResolvedValueOnce({ data: {} } as any);

        await fetchCountPaymentReportService();

        expect(mockedGet).toHaveBeenCalledWith("/financial/report/count_payment");
    });

    it("fetchAmountPaymentReportService deve chamar GET /financial/report/amount_payment", async () => {
        mockedGet.mockResolvedValueOnce({ data: {} } as any);

        await fetchAmountPaymentReportService();

        expect(mockedGet).toHaveBeenCalledWith("/financial/report/amount_payment");
    });

    it("fetchAmountPaymentOpenReportService deve chamar GET /financial/report/amount_payment_open", async () => {
        mockedGet.mockResolvedValueOnce({ data: {} } as any);

        await fetchAmountPaymentOpenReportService();

        expect(mockedGet).toHaveBeenCalledWith("/financial/report/amount_payment_open");
    });

    it("fetchAmountPaymentClosedReportService deve chamar GET /financial/report/amount_payment_closed", async () => {
        mockedGet.mockResolvedValueOnce({ data: {} } as any);

        await fetchAmountPaymentClosedReportService();

        expect(mockedGet).toHaveBeenCalledWith("/financial/report/amount_payment_closed");
    });

    it("fetchAmountInvoiceByTagReportService deve chamar GET /financial/report/amount_invoice_by_tag", async () => {
        mockedGet.mockResolvedValueOnce({ data: {} } as any);

        await fetchAmountInvoiceByTagReportService();

        expect(mockedGet).toHaveBeenCalledWith("/financial/report/amount_invoice_by_tag");
    });
});

describe("Contract services", () => {
    it("fetchAllContractService deve chamar GET /financial/contract/ com filtros", async () => {
        const filters = { page: 1 } as any;
        mockedGet.mockResolvedValueOnce({ data: { results: [] } } as any);

        await fetchAllContractService(filters);

        expect(mockedGet).toHaveBeenCalledWith("/financial/contract/", { params: filters });
    });

    it("saveNewContractService deve chamar POST /financial/contract/new com dados", async () => {
        const data = { name: "Contract 1" } as any;
        mockedPost.mockResolvedValueOnce({ data: {} } as any);

        await saveNewContractService(data);

        expect(mockedPost).toHaveBeenCalledWith("/financial/contract/new", data);
    });

    it("fetchDetailContractService deve chamar GET /financial/contract/:id/", async () => {
        mockedGet.mockResolvedValueOnce({ data: { id: 3 } } as any);

        await fetchDetailContractService(3);

        expect(mockedGet).toHaveBeenCalledWith("/financial/contract/3/");
    });

    it("fetchDetailContractInvoicesService deve chamar GET /financial/contract/:id/invoices/ com filtros", async () => {
        const filters = { page: 1 } as any;
        mockedGet.mockResolvedValueOnce({ data: { results: [] } } as any);

        await fetchDetailContractInvoicesService(3, filters);

        expect(mockedGet).toHaveBeenCalledWith("/financial/contract/3/invoices/", { params: filters });
    });

    it("mergeContractService deve chamar POST /financial/contract/:id/merge/ com dados", async () => {
        const data = { id: 1, target: 2 } as any;
        mockedPost.mockResolvedValueOnce({ data: {} } as any);

        await mergeContractService(data);

        expect(mockedPost).toHaveBeenCalledWith("/financial/contract/1/merge/", data);
    });

    it("updateAllContractsValue deve chamar POST /financial/contract/update_all_contracts_value", async () => {
        mockedPost.mockResolvedValueOnce({ data: {} } as any);

        await updateAllContractsValue();

        expect(mockedPost).toHaveBeenCalledWith("/financial/contract/update_all_contracts_value");
    });
});

describe("Invoice services", () => {
    it("fetchAllInvoiceService deve chamar GET /financial/invoice/ com filtros", async () => {
        const filters = { page: 1 } as any;
        mockedGet.mockResolvedValueOnce({ data: { results: [] } } as any);

        await fetchAllInvoiceService(filters);

        expect(mockedGet).toHaveBeenCalledWith("/financial/invoice/", { params: filters });
    });

    it("includeNewInvoiceService deve chamar POST /financial/contract/:idContract/invoice/", async () => {
        const data = { idContract: 5, value: 100 } as any;
        mockedPost.mockResolvedValueOnce({ data: {} } as any);

        await includeNewInvoiceService(data);

        expect(mockedPost).toHaveBeenCalledWith("/financial/contract/5/invoice/", data);
    });

    it("fetchDetailInvoiceService deve chamar GET /financial/invoice/:id/", async () => {
        mockedGet.mockResolvedValueOnce({ data: { id: 8 } } as any);

        await fetchDetailInvoiceService(8);

        expect(mockedGet).toHaveBeenCalledWith("/financial/invoice/8/");
    });

    it("fetchDetailInvoicePaymentsService deve chamar GET /financial/invoice/:id/payments/ com filtros", async () => {
        const filters = { page: 1 } as any;
        mockedGet.mockResolvedValueOnce({ data: { results: [] } } as any);

        await fetchDetailInvoicePaymentsService(8, filters);

        expect(mockedGet).toHaveBeenCalledWith("/financial/invoice/8/payments/", { params: filters });
    });

    it("saveInvoiceTagsService deve chamar POST /financial/invoice/:id/tags com array de IDs", async () => {
        mockedPost.mockResolvedValueOnce({ data: {} } as any);

        await saveInvoiceTagsService(4, [1, 2, 3]);

        expect(mockedPost).toHaveBeenCalledWith("/financial/invoice/4/tags", [1, 2, 3]);
    });
});

describe("Tag services", () => {
    it("fetchTagsService deve chamar GET /financial/tag/", async () => {
        mockedGet.mockResolvedValueOnce({ data: { data: [] } } as any);

        await fetchTagsService();

        expect(mockedGet).toHaveBeenCalledWith("/financial/tag/");
    });

    it("includeNewTagService deve chamar POST /financial/tag/new com nome", async () => {
        mockedPost.mockResolvedValueOnce({ data: {} } as any);

        await includeNewTagService({ name: "New Tag" });

        expect(mockedPost).toHaveBeenCalledWith("/financial/tag/new", { name: "New Tag" });
    });
});
