import { Breadcrumb, Layout } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import LoadingPage from "../../../../components/loadingPage/Index";
import LoginHeader from "../../../../components/loginHeader/Index";
import MenuAdmin from "../../../../components/menuAdmin/Index";
import Cards from "../../../../components/overview/cards";
import InvoiceByTag from "../../../../components/overview/invoiceByTag";
import PaymentFixed from "../../../../components/overview/paymentFixed";
import PaymentWithFixed from "../../../../components/overview/paymentWithFixed";
import PaymentWithoutFixed from "../../../../components/overview/paymentWithoutFixed";
import { fetchPaymentReport } from "../../../../store/features/financial/Index";
import { RootState, useAppDispatch } from "../../../../store/store";
import styles from "./Overview.module.scss";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

function Overview() {
    const financialStore = useSelector(
        (state: RootState) => state.financial.paymentReport,
    );
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchPaymentReport());
    }, []);

    console.log(financialStore.data);

    function OverviewReport() {
        return (
            <>
                <Cards
                    countPayment={financialStore.data.countPayment}
                    amountPayment={financialStore.data.amountPayment}
                    amountPaymentOpen={financialStore.data.amountPaymentOpen}
                    amountPaymentClosed={
                        financialStore.data.amountPaymentClosed
                    }
                    loading={financialStore.loading}
                />
                <div>
                    <PaymentWithFixed data={financialStore.data.payments} />
                </div>
                <div>
                    <InvoiceByTag datasets={financialStore.data.invoiceByTag} />
                </div>
                <div className={styles["charts-container"]}>
                    <PaymentWithoutFixed
                        payments={financialStore.data.payments}
                    />
                    <PaymentFixed
                        fixedCredit={financialStore.data.fixed_credit}
                        fixedDebit={financialStore.data.fixed_debit}
                    />
                </div>
            </>
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
