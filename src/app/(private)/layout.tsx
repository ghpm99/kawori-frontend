"use client";

import LoginHeader from "@/components/loginHeader/Index";

import MenuInternal from "@/components/menuInternal/Index";
import { useTheme } from "@/components/themeProvider/themeContext";
import { signoutThunk } from "@/lib/features/auth";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Layout } from "antd";
import styles from "./layout.module.scss";

const { Header, Content } = Layout;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();

    const {
        state: { theme },
    } = useTheme();

    const { status, user, selectedMenu, groups } = useAppSelector((state) => state.auth);

    const handleSignout = () => {
        dispatch(signoutThunk());
    };

    return (
        <Layout className={styles["container"]}>
            <MenuInternal selectedMenu={selectedMenu} status={status} theme={theme} groups={groups} />
            <Layout>
                <Header className={styles["header"]}>
                    <LoginHeader user={user} status={status} handleSignout={handleSignout} />
                </Header>
                <Content className={styles["content"]}>{children}</Content>
            </Layout>
        </Layout>
    );
}
