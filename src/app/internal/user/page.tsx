"use client";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Breadcrumb, Button, Layout, Typography } from "antd";

import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import LoadingPage from "@/components/loadingPage/Index";
import LoginHeader from "@/components/loginHeader/Index";
import MenuAdmin from "@/components/menuAdmin/Index";
import styles from "./User.module.scss";

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const User = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    const getBorderColor = () => {
        if (!user) {
            return "#fff";
        }
        if (user.is_superuser) {
            return "blue";
        }
        if (user.is_staff) {
            return "violet";
        }
        if (user.is_active) {
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
        <>
            <Breadcrumb className={styles["breadcrumb"]}>
                <Breadcrumb.Item>Kawori</Breadcrumb.Item>
                <Breadcrumb.Item>Usuário</Breadcrumb.Item>
            </Breadcrumb>
            <div className={styles["user-detail-container"]}>
                <Avatar
                    shape="square"
                    size="large"
                    icon={<UserOutlined />}
                    src={user?.image}
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
                        <Paragraph>{user?.name ?? ""}</Paragraph>
                    </div>
                    <div className={styles["info"]}>
                        <Title level={3}>Username</Title>
                        <div>{user?.username ?? ""}</div>
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
                            }}
                        >
                            {user?.first_name ?? ""}
                        </Paragraph>
                    </div>
                    <div className={styles["info"]}>
                        <Title level={3}>Ultimo nome</Title>
                        <Paragraph
                            editable={{
                                tooltip: "Editar nome",
                            }}
                        >
                            {user?.last_name ?? ""}
                        </Paragraph>
                    </div>
                    <div className={styles["info"]}>
                        <Title level={3}>E-mail</Title>
                        <Paragraph>{user?.email ?? ""}</Paragraph>
                    </div>
                </div>
                <div className={styles["info-container"]}>
                    <div className={styles["info"]}>
                        <Title level={3}>Ultimo login</Title>
                        <div>{user?.last_login ? formatDate(user.last_login) : ""}</div>
                    </div>
                    <div className={styles["info"]}>
                        <Title level={3}>Data cadastrada</Title>
                        <div>{user?.date_joined ? formatDate(user.date_joined) : ""}</div>
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
                    danger
                >
                    Deslogar
                </Button>
            </div>
        </>
    );
};

User.auth = {
    role: "admin",
    loading: <LoadingPage />,
    unauthorized: "/signin",
};

export default User;
