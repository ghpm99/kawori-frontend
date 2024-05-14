"use client";

import MenuHeader from "@/components/menuHeader";
import { Divider } from "antd";
import LogoKawori from "assets/kaori_logo4.png";

import Image from "next/image";
import styles from "./Home.module.scss";

import Facetexture from "@/components/landing/facetexture";
import FAQ from "@/components/landing/FAQ";
import News from "@/components/landing/news";
import UserPanel from "@/components/landing/userPanel";
import Welcome from "@/components/landing/welcome";
import { Footer } from "antd/lib/layout/layout";

export default function Home() {
    return (
        <>
            <div className={styles["container"]}>
                <MenuHeader />
                <div className={styles["body"]}>
                    <div className={styles["internal-page"]}>
                        <div className={styles["section"]}>
                            <Image alt="Kawori Logo" src={LogoKawori} className={styles["logo-image"]} width={500} />
                            <UserPanel />
                        </div>
                        <Divider />
                        <News />
                        <Divider />
                        <Welcome />
                        <Facetexture />
                        <Divider />
                        <FAQ />
                        <Divider />
                    </div>
                </div>
            </div>
            <Footer style={{ textAlign: "center", boxShadow: "0 0 7px 1px rgba(0,0,0,.1)" }}>
                Sinta-se a vontade para entrar para
                <a target="_blank" href="https://discord.gg/fykNkXyn2r">
                    &nbsp;nossa comunidade&nbsp;
                </a>
                caso tenha alguma duvida ou sugestão!
            </Footer>
        </>
    );
}
