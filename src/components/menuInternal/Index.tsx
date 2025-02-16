import { AppstoreOutlined, HomeOutlined, SettingOutlined, SnippetsOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu, MenuProps } from "antd";
import Link from "next/link";

import styles from "./Menu.module.scss";
import useMenu from "./useMenu";

import { authStatus } from "@/lib/features/auth";

type MenuItem = Required<MenuProps>["items"][number];
export type MenuItemKey =
    | "home"
    | "user"
    | "facetexture"
    | "rank"
    | "controller"
    | "command"
    | "remote"
    | "status"
    | "financial"
    | "overview"
    | "contracts"
    | "invoices"
    | "payments"
    | "tags"
    | "server";

const { Sider } = Layout;

const menuItens = (status: authStatus, isSuperuser: boolean): MenuItem[] => {
    const baseItens: MenuItem[] = [
        {
            label: <Link href={"/"}>Inicio</Link>,
            key: "home",
            icon: <HomeOutlined />,
        },
    ];

    if (status === "authenticated") {
        baseItens.push(
            {
                label: <Link href={"/internal/user"}>Conta</Link>,
                key: "user",
                icon: <UserOutlined />,
            },
            {
                label: <Link href={"/internal/facetexture"}>Facetexture</Link>,
                key: "facetexture",
                icon: <AppstoreOutlined />,
            },
            {
                label: <Link href={"/internal/rank"}>Rank de classes</Link>,
                key: "rank",
                icon: <AppstoreOutlined />,
            },
        );
    }

    if (isSuperuser) {
        baseItens.push(
            {
                label: "Financeiro",
                key: "financial",
                icon: <SnippetsOutlined />,
                children: [
                    {
                        label: <Link href={"/admin/financial/overview"}>Overview</Link>,
                        key: "overview",
                        icon: <SnippetsOutlined />,
                    },
                    {
                        label: <Link href={"/admin/financial/contracts"}>Contratos</Link>,
                        key: "contracts",
                        icon: <SnippetsOutlined />,
                    },
                    {
                        label: <Link href={"/admin/financial/invoices"}>Notas</Link>,
                        key: "invoices",
                        icon: <SnippetsOutlined />,
                    },
                    {
                        label: <Link href={"/admin/financial/payments"}>Pagamentos</Link>,
                        key: "payments",
                        icon: <SnippetsOutlined />,
                    },
                    {
                        label: <Link href={"/admin/financial/tags"}>Tags</Link>,
                        key: "tags",
                        icon: <SnippetsOutlined />,
                    },
                ],
            },
            {
                label: <Link href={"/admin/server"}>Servidor</Link>,
                key: "server",
                icon: <SettingOutlined />,
            },
        );
    }

    return baseItens;
};

function MenuInternal() {
    const { status, toggleCollapsed, user, selectedMenu, theme } = useMenu();

    return (
        <Sider breakpoint="lg" collapsedWidth="0" onCollapse={toggleCollapsed} theme={theme}>
            <div className={styles["logo-container"]}>
                <Link href="/" className={styles["logo"]}>
                    Kawori
                </Link>
            </div>
            <Menu
                theme={theme}
                selectedKeys={selectedMenu}
                mode="vertical"
                items={menuItens(status, user.is_superuser)}
            />
        </Sider>
    );
}

export default MenuInternal;
