"use client";

import LoginHeader from "@/components/loginHeader/Index";
import MenuAdmin from "@/components/menuAdmin/Index";
import { Layout } from "antd";
import styles from "./layout.module.scss";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";

const { Header, Content } = Layout;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const authStore = useAppSelector((state) => state.auth);
    const navigate = useRouter();

    console.log("authStore", authStore);
    if (authStore.loading === false && authStore.status === "unauthenticated") {
        console.log("nao autenticado");
        navigate.push("/signout");
    }
    return (
        <Layout className={styles["container"]}>
            <MenuAdmin selected={["facetexture"]} />
            <Layout>
                <Header className={styles["header"]}>
                    <LoginHeader />
                </Header>
                <Content>{authStore.loading ? <div>Loading...</div> : children}</Content>
            </Layout>
        </Layout>
    );
}
