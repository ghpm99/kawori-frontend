import { Button, List, Tabs, TabsProps } from "antd"
import useUserPanel from "./useUserPanel"

import LoginPage from "@/components/signin"
import SingupForm from "@/components/signup"
import Link from "next/link"
import styles from "./userPanel.module.scss"

const tabItens: TabsProps["items"] = [
    {
        key: "signup",
        label: "Cadastro",
        children: (
            <div className={styles["form-container"]}>
                <div className={styles["form-title"]}>Cadastro</div>
                <SingupForm />
            </div>
        ),
    },
    {
        key: "signin",
        label: "Login",
        children: (
            <div className={styles["form-container"]}>
                <div className={styles["form-title"]}>Login</div>
                <LoginPage />
            </div>
        ),
    },
];

const UserPanel = () => {
    const { user, status, formatDate } = useUserPanel();

    console.log("user panel", status, user);

    if (!status || status === "unauthenticated") {
        return (
            <div className={styles["tabs"]}>
                <Tabs centered items={tabItens} />
            </div>
        );
    }

    return (
        <>
            <div className={styles["user-container"]}>
                <strong className={styles["form-title"]}>Usuario logado</strong>
                <div>
                    <div className={styles["user-option"]}>Nome: {user.name}</div>
                    <div className={styles["user-option"]}>
                        Data de cadastro: {user.date_joined ? formatDate(user.date_joined) : ""}
                    </div>
                    <div className={styles["user-option"]}>
                        Ultimo login: {user.last_login ? formatDate(user.last_login) : ""}
                    </div>
                    <div className={styles["status"]}>
                        <div
                            className={`${styles["status-indicator"]} ${
                                user.is_active ? styles["active"] : styles["inactive"]
                            }`}
                        ></div>
                        <div className={styles["status-text"]}>{user.is_active ? "Ativo" : "Banido"}</div>
                    </div>
                </div>
                <div className={styles["access-list"]}>
                    <List
                        header={<strong>Acesso Rápido</strong>}
                        bordered
                        dataSource={[
                            { text: "Perfil", link: "/internal/user" },
                            { text: "Facetexture", link: "/internal/facetexture" },
                        ]}
                        renderItem={(item) => (
                            <List.Item>
                                <Link href={item.link}>{item.text}</Link>
                            </List.Item>
                        )}
                    />
                </div>
                <div>
                    <Button
                        type="primary"
                        danger
                        style={{
                            float: "right",
                        }}
                    >
                        Deslogar
                    </Button>
                </div>
            </div>
        </>
    );
};

export default UserPanel;
