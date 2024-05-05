"use client";
import {
    AppstoreOutlined,
    DesktopOutlined,
    HddOutlined,
    HomeOutlined,
    SettingOutlined,
    SnippetsOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Link from "next/link";

import styles from "./Menu.module.scss";
import useMenu from "./useMenu";

import LogoImage from "assets/logo-white.png";
import Image from "next/image";

const { Sider } = Layout;

function MenuAdmin(props: { selected: string[] }) {
    const context = useMenu();

    return (
        <Sider breakpoint="lg" collapsedWidth="0" onCollapse={context.toggleCollapsed}>
            <Link href="/" className={styles["menu-item"]}>
                <Image className={styles.logo} alt="Logo" src={LogoImage} width={100} />
            </Link>
            <Menu theme="dark" selectedKeys={props.selected} mode="inline">
                <Menu.Item key="home" icon={<HomeOutlined />}>
                    <Link href={"/"}>Inicio</Link>
                </Menu.Item>
                {context.status === "authenticated" && (
                    <>
                        <Menu.Item key="user" icon={<UserOutlined />} title="Usuario">
                            <Link href={"/admin/user"}>Conta</Link>
                        </Menu.Item>
                        <Menu.Item key="facetexture" icon={<AppstoreOutlined />}>
                            <Link href={"/admin/facetexture"}>Facetexture</Link>
                        </Menu.Item>
                        <Menu.Item key="rank" icon={<AppstoreOutlined />}>
                            <Link href={"/admin/rank"}>Rank de classes</Link>
                        </Menu.Item>
                        {context.data?.user.isSuperuser && (
                            <>
                                <Menu.SubMenu key="controller" icon={<DesktopOutlined />} title="Remoto">
                                    <Menu.Item key="command" icon={<DesktopOutlined />}>
                                        <Link href={"/admin/controller/command"}>Comando</Link>
                                    </Menu.Item>
                                    <Menu.Item key="remote" icon={<DesktopOutlined />}>
                                        <Link href={"/admin/controller/remote"}>Remoto</Link>
                                    </Menu.Item>
                                    <Menu.Item key="status" icon={<HddOutlined />}>
                                        <Link href={"/admin/controller/status"}>Status</Link>
                                    </Menu.Item>
                                </Menu.SubMenu>
                                <Menu.SubMenu key="financial" icon={<SnippetsOutlined />} title="Financeiro">
                                    <Menu.Item key="overview">
                                        <Link href={"/admin/financial/overview"}>Overview</Link>
                                    </Menu.Item>
                                    <Menu.Item key="contracts">
                                        <Link href={"/admin/financial/contracts"}>Contratos</Link>
                                    </Menu.Item>
                                    <Menu.Item key="invoices">
                                        <Link href={"/admin/financial/invoices"}>Notas</Link>
                                    </Menu.Item>
                                    <Menu.Item key="payments">
                                        <Link href={"/admin/financial/payments"}>Pagamentos</Link>
                                    </Menu.Item>
                                    <Menu.Item key="tags">
                                        <Link href={"/admin/financial/tags"}>Tags</Link>
                                    </Menu.Item>
                                </Menu.SubMenu>
                                <Menu.Item key="server" icon={<SettingOutlined />}>
                                    <Link href={"/admin/server"}>Servidor</Link>
                                </Menu.Item>
                            </>
                        )}
                    </>
                )}
            </Menu>
        </Sider>
    );
}

export default MenuAdmin;
