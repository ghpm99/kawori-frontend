"use client";

import LoginHeader from "@/components/loginHeader/Index";

import { Layout } from "antd";
import styles from "./layout.module.scss";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import MenuInternal from "@/components/menuInternal/Index";
import ThemeControl from "@/components/themeControl";

const { Header, Content } = Layout;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const authStore = useAppSelector((state) => state.auth);
    const navigate = useRouter();

    if (authStore.loading === false && authStore.status === "unauthenticated") {
        navigate.push("/signout");
    }

    return (
        <Layout className={styles["container"]}>
            <MenuInternal />
            <Layout>
                <Header className={styles["header"]}>
                    <ThemeControl />
                    <LoginHeader />
                </Header>
                <Content className={styles["content"]}>{children}</Content>
            </Layout>
        </Layout>
    );
}
