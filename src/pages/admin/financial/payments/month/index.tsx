import {
    fetchMonthPayments
} from "@/store/features/financial/payment"
import { Breadcrumb, Layout, Table, Typography } from "antd"
import LoadingPage from "components/loadingPage/Index"
import LoginHeader from "components/loginHeader/Index"
import MenuAdmin from "components/menuAdmin/Index"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState, useAppDispatch } from "store/store"

import { formatMoney } from "@/util/index"
import styles from "./Payments.module.scss"

const { Header, Content } = Layout;

const { Title } = Typography;

function FinancialPage() {
    const financialStore = useSelector((state: RootState) => state.financial.payment);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchMonthPayments());
    }, []);

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
            title: "Tipo",
            dataIndex: "type",
            key: "type",
            render: (text: any) => (text === 0 ? "Credito" : "Debito"),
        },
        {
            title: "Valor Total",
            dataIndex: "total_value",
            key: "total_value",
            render: (value: any) => formatMoney(value),
        },
    ];

    return (
        <Layout className={styles.container}>
            <MenuAdmin selected={["month-payments"]} />
            <Layout>
                <Header className={styles.header}>
                    <LoginHeader />
                </Header>
                <Content>
                    <Breadcrumb className={styles.breadcrumb}>
                        <Breadcrumb.Item>Kawori</Breadcrumb.Item>
                        <Breadcrumb.Item>Financeiro</Breadcrumb.Item>
                        <Breadcrumb.Item>Em aberto</Breadcrumb.Item>
                    </Breadcrumb>
                    <Layout>
                        <div className={styles.header_command}>
                            <Title level={3} className={styles.title}>
                                Pagamentos do Mês
                            </Title>
                        </div>
                        <Table
                            columns={headerTableFinancial}
                            dataSource={financialStore.month}
                            loading={financialStore.loading}
                            summary={(paymentData) => <TableSummary paymentData={paymentData} />}
                        />
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
        if (payment.type === 0) {
            total = total + payment.total_value;
            totalCredit = totalCredit + payment.total_value;
        } else {
            total = total - payment.total_value;
            totalDebit = totalDebit + payment.total_value;
        }
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

FinancialPage.auth = {
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

export default FinancialPage;
