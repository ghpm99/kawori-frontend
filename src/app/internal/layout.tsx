"use client";

import LoginHeader from "@/components/loginHeader/Index"
import MenuAdmin from "@/components/menuAdmin/Index"
import { Layout } from "antd"
import styles from "./layout.module.scss"
import { useAppSelector } from '@/lib/hooks'
import { useRouter } from 'next/navigation'

const { Header, Content } = Layout;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

    const authStore = useAppSelector((state) => state.auth)
    const navigate = useRouter();

    if (authStore.status === 'unauthenticated'){
        navigate.push("/signout");
    }
    return (
        <Layout className={styles["container"]}>
            <MenuAdmin selected={["facetexture"]} />
            <Layout>
                <Header className={styles["header"]}>
                    <LoginHeader />
                </Header>
                <Content>
                {children}
                </Content>
            </Layout>
        </Layout>
    );
}
