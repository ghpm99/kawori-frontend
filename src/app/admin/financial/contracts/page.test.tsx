import { renderWithProviders } from "@/util/test-utils";
import { screen } from "@testing-library/react";
import FinancialPage from "./page";

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
    usePathname: () => "/admin/financial/contracts",
}));

// Prevent module-level apiAuth.get("/csrf/") from creating unhandled rejections
jest.mock("@/services/auth", () => ({
    refreshTokenAsync: jest.fn(),
    refreshTokenService: jest.fn(),
    signupService: jest.fn(),
}));

// Mock financial service to prevent real API calls
jest.mock("@/services/financial", () => ({
    fetchAllContractService: jest.fn().mockResolvedValue({ data: [], count: 0 }),
    saveNewContractService: jest.fn(),
    updateAllContractsValue: jest.fn(),
}));

// Lightweight antd mock — supports both Breadcrumb.Item and items array patterns
jest.mock("antd", () => {
    const MockBreadcrumb = ({ items, children }: any) => (
        <nav>
            {items?.map((i: any) => (
                <span key={i.title}>{i.title}</span>
            ))}
            {children}
        </nav>
    );
    MockBreadcrumb.Item = ({ children }: any) => <span>{children}</span>;
    const MockTable = ({ columns, dataSource, summary }: any) => (
        <div>
            <div>
                {columns?.map((col: any) => (
                    <span key={col.key}>{col.title}</span>
                ))}
            </div>
            {summary && summary(dataSource ?? [])}
        </div>
    );
    MockTable.Summary = {
        Row: ({ children }: any) => <tr>{children}</tr>,
        Cell: ({ children }: any) => <td>{children}</td>,
    };
    const MockLayout = ({ children }: any) => <div>{children}</div>;
    return {
        Breadcrumb: MockBreadcrumb,
        Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
        Layout: MockLayout,
        Table: MockTable,
        Typography: {
            Title: ({ children }: any) => <h3>{children}</h3>,
            Text: ({ children }: any) => <span>{children}</span>,
        },
        message: { success: jest.fn(), error: jest.fn(), loading: jest.fn() },
    };
});

jest.mock("@/components/financial/contracts/openModalNewContract", () => () => null);
jest.mock("@/components/contracts/modalNew", () => () => null);
jest.mock("@/components/loadingPage/Index", () => () => null);

describe("FinancialPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should render FinancialPage correctly", () => {
        renderWithProviders(<FinancialPage searchParams={{}} />);

        expect(screen.getByText("Kawori")).toBeInTheDocument();
        expect(screen.getByText("Financeiro")).toBeInTheDocument();
        expect(screen.getAllByText("Em aberto")[0]).toBeInTheDocument();
        expect(screen.getByText("Valores em aberto")).toBeInTheDocument();
    });

    test("should render table with correct columns", () => {
        renderWithProviders(<FinancialPage searchParams={{}} />);

        expect(screen.getByText("Id")).toBeInTheDocument();
        expect(screen.getByText("Nome")).toBeInTheDocument();
        expect(screen.getByText("Total")).toBeInTheDocument();
        expect(screen.getByText("Baixado")).toBeInTheDocument();
        expect(screen.getAllByText("Em aberto")[0]).toBeInTheDocument();
        expect(screen.getByText("Ações")).toBeInTheDocument();
    });
});
