"use client";
import Link from "next/link";

import LogoImage from "assets/logo.png";
import { Menu } from "antd";

import Image from "next/image";
import styles from "./MenuHeader.module.scss";
import useMenuHeader from "./useMenuHeader";

export default function MenuHeader() {
    const { data, status } = useMenuHeader();

    const menuItens = [
        {
            label: <Link href={"/"}>Inicio</Link>,
            key: "home",
        },
        {
            label: "Black Desert",
            key: "blackdesert",
            children: [
                {
                    label: <Link href={"/facetexture"}>Facetexture</Link>,
                    key: "facetexture",
                },
                {
                    label: <Link href={"/rank"}>Rank de Classes</Link>,
                    key: "rank",
                },
            ],
        },
        status === "authenticated"
            ? {
                  label: data.name,
                  key: "user",
                  children: [
                      {
                          label: <Link href={"/internal/user"}>Conta</Link>,
                          key: "user-account",
                      },
                      {
                          label: <Link href={"/internal/facetexture"}>Facetexture</Link>,
                          key: "user-facetexture",
                      },
                      {
                          label: <Link href={"/internal/rank"}>Rank de Classes</Link>,
                          key: "user-classification",
                      },
                      {
                          label: <div>Sair</div>,
                          key: "user-logout",
                          danger: true,
                      },
                  ],
              }
            : {
                  label: <Link href={"/#login"}>Logar</Link>,
                  key: "login",
              },
    ];

    return (
        <div className={styles["menu-header"]}>
            <div className={styles["menu"]}>
                <Link href="/" className={styles["menu-item"]}>
                    <Image alt="Logo" src={LogoImage} width={100} />
                </Link>
            </div>
            <div className={styles["user-container"]}>
                <Menu
                    style={{
                        border: "none",
                    }}
                    disabledOverflow
                    mode="horizontal"
                    items={menuItens}
                />
            </div>
        </div>
    );
}
