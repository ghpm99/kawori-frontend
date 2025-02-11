"use client";
import Link from "next/link";

import LogoImage from "assets/logo.png";
import { Menu, Tooltip } from "antd";

import Image from "next/image";
import styles from "./MenuHeader.module.scss";
import useMenuHeader from "./useMenuHeader";
import { ExclamationCircleOutlined, MoonOutlined, SunFilled, SunOutlined } from "@ant-design/icons";
import ThemeControl from "../themeControl";

export default function MenuHeader() {
    const { data, status, theme } = useMenuHeader();

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
        <div className={`${styles["menu-header"]} ${styles[theme]}`}>
            <div className={styles["logo-container"]}>
                <Link href="/" className={`${styles["logo"]} ${styles[theme]}`}>
                    Kawori
                </Link>
            </div>
            <div className={styles["user-container"]}>
                <ThemeControl />
                <Menu disabledOverflow mode="horizontal" items={menuItens} />
            </div>
        </div>
    );
}
