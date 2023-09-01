import { UserOutlined } from "@ant-design/icons";
import { Avatar, Breadcrumb, Button, Layout, Typography } from "antd";
import { signOut, useSession } from "next-auth/react";

import LoadingPage from "../../../components/loadingPage/Index";
import LoginHeader from "../../../components/loginHeader/Index";
import MenuAdmin from "../../../components/menuAdmin/Index";
import styles from "./User.module.scss";

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const User = () => {
    const { data } = useSession();

    const session = data ? data : null;

    const getBorderColor = () => {
        if (!session) {
            return "#fff";
        }
        if (session.user.isSuperuser) {
            return "blue";
        }
        if (session.user.isStaff) {
            return "violet";
        }
        if (session.user.isActive) {
            return "green";
        } else {
            return "red";
        }
    };

    const formatDate = (date: string) => {
        const dateFormat = new Date(date);
        return dateFormat.toLocaleString();
    };

    return (
        <Layout className={styles["container"]}>
            <MenuAdmin selected={["user"]} />
            <Layout>
                <Header className={styles.header}>
                    <LoginHeader />
                </Header>
                <Content>
                    <Breadcrumb className={styles.breadcrumb}>
                        <Breadcrumb.Item href="/">Kawori</Breadcrumb.Item>
                        <Breadcrumb.Item>Usuário</Breadcrumb.Item>
                    </Breadcrumb>
                    <Layout>
                        <div className={styles["user-detail-container"]}>
                            <Avatar
                                shape="square"
                                size="large"
                                icon={<UserOutlined />}
                                src={session?.user?.image}
                                style={{
                                    border: `1px solid ${getBorderColor()}`,
                                    marginBottom: "10px",
                                    marginTop: "16px",
                                    marginLeft: "16px",
                                }}
                            />
                            <div className={styles["info-container"]}>
                                <div className={styles["info"]}>
                                    <Title level={3}>Nome</Title>
                                    <Paragraph>{session?.user?.name ?? ""}</Paragraph>
                                </div>
                                <div className={styles["info"]}>
                                    <Title level={3}>Username</Title>
                                    <div>{session?.user?.username ?? ""}</div>
                                </div>
                                <div className={styles["info"]}>
                                    <Title level={3}>Status</Title>
                                    <div className={styles["status"]}>
                                        <div className={styles["status-indicator"]}></div>
                                        <div className={styles["status-text"]}>Ativo</div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles["info-container"]}>
                                <div className={styles["info"]}>
                                    <Title level={3}>Primeiro nome</Title>
                                    <Paragraph
                                        editable={{
                                            tooltip: "Editar nome",
                                        }}>
                                        {session?.user?.firstName ?? ""}
                                    </Paragraph>
                                </div>
                                <div className={styles["info"]}>
                                    <Title level={3}>Ultimo nome</Title>
                                    <Paragraph
                                        editable={{
                                            tooltip: "Editar nome",
                                        }}>
                                        {session?.user?.lastName ?? ""}
                                    </Paragraph>
                                </div>
                                <div className={styles["info"]}>
                                    <Title level={3}>E-mail</Title>
                                    <Paragraph>{session?.user?.email ?? ""}</Paragraph>
                                </div>
                            </div>
                            <div className={styles["info-container"]}>
                                <div className={styles["info"]}>
                                    <Title level={3}>Ultimo login</Title>
                                    <div>{session?.user?.lastLogin ? formatDate(session.user.lastLogin) : ""}</div>
                                </div>
                                <div className={styles["info"]}>
                                    <Title level={3}>Data cadastrada</Title>
                                    <div>{session?.user?.dateJoined ? formatDate(session.user.dateJoined) : ""}</div>
                                </div>
                                <div className={styles["info"]}>
                                    <Title level={3}>Senha</Title>
                                    <div>Alterar senha</div>
                                </div>
                            </div>
                            <Button
                                style={{
                                    marginRight: "16px",
                                    float: "right",
                                }}
                                type="primary"
                                onClick={() => signOut()}>
                                Deslogar
                            </Button>
                        </div>
                    </Layout>
                </Content>
            </Layout>
        </Layout>
    );
};

User.auth = {
    role: "admin",
    loading: <LoadingPage />,
    unauthorized: "/signin",
};

export default User;
