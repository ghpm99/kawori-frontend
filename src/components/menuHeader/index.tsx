import Link from "next/link"

import LogoImage from "@/public/logo.png"
import { Menu } from "antd"
import { signOut } from "next-auth/react"
import Image from "next/image"
import styles from "./MenuHeader.module.scss"
import useMenuHeader from "./useMenuHeader"


export default function MenuHeader() {
    const context = useMenuHeader();

    return (
        <div className={styles["menu-header"]}>
            <div className={styles["menu"]}>
                <Link href="/" className={styles["menu-item"]}>
                    <Image alt="Logo" src={LogoImage} width={100} />
                </Link>
            </div>
            <div className={styles["user-container"]}>
                <Menu
                    disabledOverflow
                    mode="horizontal"
                    items={[
                        {
                            label: "Inicio",
                            key: "home",
                        },
                        {
                            label: "Black Desert",
                            key: "blackdesert",
                            children: [
                                {
                                    label: "Facetexture",
                                    key: "facetexture",
                                },
                            ],
                        },
                        context.status === "authenticated" ? {
                            label: context.data?.user.name,
                            key: "user",
                            children: [
                                {
                                    label: <Link href={"/admin/user"}>Conta</Link>,
                                    key: "user-account",
                                },
                                {
                                    label:  <Link href={"/admin/facetexture"}>Facetexture</Link>,
                                    key: "user-facetexture",
                                },
                                {
                                    label: <div onClick={() => signOut()}>Sair</div>,
                                    key: "user-logout",
                                    danger: true,
                                },
                            ],
                        } : {
                            label: (
                                <Link href="/signin">
                                    Logar
                                </Link>
                            ),
                            key: "login",
                        }
                    ]}
                />
            </div>
        </div>
    );
}
