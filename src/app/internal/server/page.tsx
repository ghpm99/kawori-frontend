"use client";
import { Breadcrumb, Button, Layout, message } from "antd";

import LoadingPage from "@/components/loadingPage/Index";
import LoginHeader from "@/components/loginHeader/Index";
import MenuAdmin from "@/components/menuAdmin/Index";
import { updateAllContractsValue } from "@/services/financial";
import styles from "./Server.module.scss";

const { Header, Content } = Layout;

function ServerPage() {
    const updateContractsValue = () => {
        message.loading({
            content: "Calculando contratos",
            key: "calculate-contracts",
        });
        updateAllContractsValue().then((response) => {
            message.success({
                content: response.data.msg,
                key: "calculate-contracts",
            });
        });
    };

    return (
        <Layout className={styles.container}>
            <MenuAdmin selected={["server"]} />
            <Layout>
                <Header className={styles.header}>
                    <LoginHeader />
                </Header>
                <Content>
                    <Breadcrumb className={styles.breadcrumb}>
                        <Breadcrumb.Item>Kawori</Breadcrumb.Item>
                        <Breadcrumb.Item>Servidor</Breadcrumb.Item>
                    </Breadcrumb>
                    <Layout>
                        <div className={styles["button-container"]}>
                            <Button type="primary" onClick={updateContractsValue}>
                                Calcular valores contratos
                            </Button>
                        </div>
                    </Layout>
                </Content>
            </Layout>
        </Layout>
    );
}

ServerPage.auth = {
    role: "admin",
    loading: <LoadingPage />,
    unauthorized: "/signin",
};

export default ServerPage;
