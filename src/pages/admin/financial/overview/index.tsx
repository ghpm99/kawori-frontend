import { Breadcrumb, Flex, Layout, Table, Typography } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    ArcElement,
} from "chart.js";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import {
    fetchAmountForecastValueThunk,
    fetchAmountInvoiceByTagReportThunk,
    fetchAmountPaymentClosedReportThunk,
    fetchAmountPaymentOpenReportThunk,
    fetchAmountPaymentReportThunk,
    fetchCountPaymentReportThunk,
    fetchPaymentReportThunk,
} from "services/financial/overview";
import LoadingPage from "@/components/loadingPage/Index";
import LoginHeader from "@/components/loginHeader/Index";
import MenuAdmin from "@/components/menuAdmin/Index";
import Cards from "@/components/overview/cards";
import InvoiceByTag from "@/components/overview/invoiceByTag";
import PaymentFixed from "@/components/overview/paymentFixed";
import PaymentWithFixed from "@/components/overview/paymentWithFixed";
import AccumulatedValue from "@/components/overview/paymentWithoutFixed";
import { RootState, useAppDispatch } from "@/store/store";
import styles from "./Overview.module.scss";
import Sider from "antd/lib/layout/Sider";
import { fetchMonthPayments } from '@/store/features/financial/payment'
import { formatMoney } from '@/util/index'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const headerTableFinancial = [
    {
        title: "ID",
        dataIndex: "id",
        key: "id",
    },
    {
        title: "Nome",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Total entrada",
        dataIndex: "total_value_credit",
        key: "total_value_credit",
        render: (value: any) => value ? formatMoney(value) : '',
    },
    {
        title: "Total saida",
        dataIndex: "total_value_debit",
        key: "total_value_debit",
        render: (value: any) => value ? formatMoney(value) : '',
    },
    {
        title: "Total em aberto",
        dataIndex: "total_value_open",
        key: "total_value_open",
        render: (value: any) => value ? formatMoney(value) : '',
    },
    {
        title: "Total baixado",
        dataIndex: "total_value_closed",
        key: "total_value_closed",
        render: (value: any) => value ? formatMoney(value) : '',
    },
    {
        title: "Totais de pagamentos",
        dataIndex: "total_payments",
        key: "total_payments",
    },
];
function Overview() {
    const overviewStore = useSelector((state: RootState) => state.financial.overview);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchMonthPayments());
        dispatch(fetchPaymentReportThunk());
        dispatch(fetchCountPaymentReportThunk());
        dispatch(fetchAmountPaymentReportThunk());
        dispatch(fetchAmountPaymentOpenReportThunk());
        dispatch(fetchAmountPaymentClosedReportThunk());
        dispatch(fetchAmountInvoiceByTagReportThunk());
        dispatch(fetchAmountForecastValueThunk());
    }, []);



    function OverviewReport() {
        return (
            <Flex align='center' vertical gap={'8px'}>
                <Cards
                    countPayment={overviewStore.data.countPayment}
                    amountPayment={overviewStore.data.amountPayment}
                    amountPaymentOpen={overviewStore.data.amountPaymentOpen}
                    amountPaymentClosed={overviewStore.data.amountPaymentClosed}
                    loading={overviewStore.loading}
                />
                <Table
                            columns={headerTableFinancial}
                            dataSource={overviewStore.data.month}
                            loading={overviewStore.loading}
                            summary={(paymentData) => <TableSummary paymentData={paymentData} />}
                        />
                <PaymentWithFixed data={overviewStore.data.payments} />
                <InvoiceByTag data={overviewStore.data.invoiceByTag} />

                    <AccumulatedValue
                        payments={overviewStore.data.payments}
                        amountForecastValue={overviewStore.data.amountForecastValue}
                    />
                    <PaymentFixed
                        fixedCredit={overviewStore.data.fixed_credit}
                        fixedDebit={overviewStore.data.fixed_debit}
                    />

            </Flex>
        );
    }

    return (
        <Layout className={styles.container}>
            <MenuAdmin selected={["overview"]} />
            <Layout>
                <Header className={styles.header}>
                    <LoginHeader />
                </Header>
                <Content>
                    <Breadcrumb className={styles.breadcrumb}>
                        <Breadcrumb.Item>Kawori</Breadcrumb.Item>
                        <Breadcrumb.Item>Financeiro</Breadcrumb.Item>
                        <Breadcrumb.Item>Overview</Breadcrumb.Item>
                    </Breadcrumb>
                    <Layout>
                        <OverviewReport />
                    </Layout>
                </Content>
            </Layout>
        </Layout>
    );
}

function TableSummary({ paymentData }: { paymentData: readonly IPaymentMonth[] }) {
    const { Text } = Typography;

    let total = 0;
    let totalCredit = 0;
    let totalDebit = 0;
    paymentData.forEach((payment) => {
            totalCredit = totalCredit + payment.total_value_credit;
            totalDebit = totalDebit + payment.total_value_debit;
    });

    return (
        <>
            <Table.Summary.Row>
                <Table.Summary.Cell colSpan={2} index={0}>
                    <Text>Total: {formatMoney(total)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                    <Text>Total Credito: {formatMoney(totalCredit)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                    <Text>Total Debito: {formatMoney(totalDebit)}</Text>
                </Table.Summary.Cell>
            </Table.Summary.Row>
        </>
    );
}

Overview.auth = {
    role: "admin",
    loading: <LoadingPage />,
    unauthorized: "/signin",
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getSession({ req });

    const isSuperuser = session?.user.isSuperuser ?? false;

    if (!isSuperuser) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
    return {
        props: {},
    };
};

export default Overview;
