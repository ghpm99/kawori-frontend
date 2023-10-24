import { Breadcrumb, Layout } from "antd";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

function Overview() {
    const overviewStore = useSelector((state: RootState) => state.financial.overview);
    const dispatch = useAppDispatch();

    useEffect(() => {
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
            <>
                <Cards
                    countPayment={overviewStore.data.countPayment}
                    amountPayment={overviewStore.data.amountPayment}
                    amountPaymentOpen={overviewStore.data.amountPaymentOpen}
                    amountPaymentClosed={overviewStore.data.amountPaymentClosed}
                    loading={overviewStore.loading}
                />
                <div>
                    <PaymentWithFixed data={overviewStore.data.payments} />
                </div>
                <div>
                    <InvoiceByTag data={overviewStore.data.invoiceByTag} />
                </div>
                <div className={styles["charts-container"]}>
                    <AccumulatedValue
                        payments={overviewStore.data.payments}
                        amountForecastValue={overviewStore.data.amountForecastValue}
                    />
                    <PaymentFixed
                        fixedCredit={overviewStore.data.fixed_credit}
                        fixedDebit={overviewStore.data.fixed_debit}
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
