import {
    Breadcrumb,
    DatePicker,
    Layout,
    Select,
    Table,
    Typography,
} from "antd";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";

import LoadingPage from "../../../../components/loadingPage/Index";
import LoginHeader from "../../../../components/loginHeader/Index";
import MenuCollapsible from "../../../../components/menuAdmin/Index";
import { RootState } from "../../../../store/store";
import styles from "./Report.module.scss";

const { Header, Content, Footer } = Layout;

const { Title } = Typography;
const { Option } = Select;

function FinancialPage() {
    const statusStore = useSelector((state: RootState) => state.financial);
    const dispatch = useDispatch();

    const dateFormat = "DD/MM/YYYY";
    const customFormat = (value: any) => `${value.format(dateFormat)}`;

    const formatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    const headerTableFinancial = [
        {
            title: "Tipo",
            dataIndex: "type",
            key: "type",
            render: (text: any) => (text === 0 ? "Credito" : "Debito"),
        },
        {
            title: "Data",
            dataIndex: "date",
            key: "dataIndex",
        },
        {
            title: "Nome",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Valor",
            dataIndex: "value",
            key: "value",
        },
        {
            title: "Parcelas",
            dataIndex: "installments",
            key: "installments",
        },
        {
            title: "Dia de pagamento",
            dataIndex: "payment_date",
            key: "payment_date",
        },
        {
            title: "Fixo",
            dataIndex: "fixed",
            key: "fixed",
            render: (value: any) => (value ? "Sim" : "Não"),
        },
    ];

    return (
        <Layout className={styles.container}>
            <MenuCollapsible selected={["report"]} />
            <Layout>
                <Header className={styles.header}>
                    <LoginHeader />
                </Header>
                <Content>
                    <Breadcrumb className={styles.breadcrumb}>
                        <Breadcrumb.Item>Kawori</Breadcrumb.Item>
                        <Breadcrumb.Item>Financeiro</Breadcrumb.Item>
                        <Breadcrumb.Item>Relatorio</Breadcrumb.Item>
                    </Breadcrumb>
                    <Layout>
                        <Title level={4}>Relatorio por mes:</Title>
                        <DatePicker
                            format="MM/DD"
                            picker="month"
                            defaultValue={dayjs(new Date(), "MM/DD")}
                        />
                        <Table columns={headerTableFinancial} />
                    </Layout>
                </Content>
            </Layout>
        </Layout>
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
    return { props: {} };
};

export default FinancialPage;
