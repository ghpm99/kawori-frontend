'use client'
import { Breadcrumb, Layout, Table } from "antd";
import { useRouter } from "next/router";

import Loading from "@/components/facetexture/loading";
import LoginHeader from "@/components/loginHeader/Index";
import MenuAdmin from "@/components/menuAdmin/Index";
import Styles from "./layout.module.scss";
import { useAppDispatch } from "@/store/store";
import { useEffect } from "react";
import { getAllAnswers } from "@/services/classification";
import Link from "next/link";

const { Header, Content } = Layout;


  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <Layout className={Styles["container"]}>
        <MenuAdmin selected={["rank"]} />
        <Layout>
            <Header className={Styles["header"]}>
                <LoginHeader />
            </Header>
            <Content>
                <Breadcrumb className={Styles["breadcrumb"]}>
                    <Breadcrumb.Item>Kawori</Breadcrumb.Item>
                    <Breadcrumb.Item>Rank de classes</Breadcrumb.Item>
                </Breadcrumb>
                <div className={Styles["container-toolkit"]}>
                    {children}
                </div>
            </Content>
        </Layout>
    </Layout>
    )
  }
