"use client";
import { Button, List, Tabs, TabsProps } from "antd";
import useUserPanel from "./useUserPanel";

import styles from "./userPanel.module.scss";
import SingupForm from "@/components/signup";
import LoginPage from "@/components/signin";
import Link from "next/link";

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
    const { data, status, formatDate } = useUserPanel();

    return (
        <>
            {status === "authenticated" && (
                <div className={styles["user-container"]}>
                    <strong className={styles["form-title"]}>Usuario logado</strong>
                    <div>
                        <div className={styles["user-option"]}>Nome: {data?.user.name}</div>
                        <div className={styles["user-option"]}>
                            Data de cadastro: {data?.user.date_joined ? formatDate(data?.user.date_joined) : ""}
                        </div>
                        <div className={styles["user-option"]}>
                            Ultimo login: {data?.user.last_login ? formatDate(data?.user.last_login) : ""}
                        </div>
                        <div className={styles["status"]}>
                            <div
                                className={`${styles["status-indicator"]} ${
                                    data?.user.is_active ? styles["active"] : styles["inactive"]
                                }`}
                            ></div>
                            <div className={styles["status-text"]}>{data?.user.is_active ? "Ativo" : "Banido"}</div>
                        </div>
                    </div>
                    <div className={styles["access-list"]}>
                        <List
                            header={<strong>Acesso Rápido</strong>}
                            bordered
                            dataSource={[
                                { text: "Perfil", link: "/admin/user" },
                                { text: "Facetexture", link: "/admin/facetexture" },
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
            )}
            {status === "unauthenticated" && (
                <div className={styles["tabs"]}>
                    <Tabs centered items={tabItens} />
                </div>
            )}
        </>
    );
};

export default UserPanel;
