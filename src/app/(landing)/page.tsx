"use client";

import { Divider } from "antd";
import LogoKawori from "assets/kaori_logo6.png";

import Image from "next/image";
import styles from "./Home.module.scss";

import Facetexture from "@/components/landing/facetexture";
import FAQ from "@/components/landing/FAQ";
import News from "@/components/landing/news";
import UserPanel from "@/components/landing/userPanel";
import Welcome from "@/components/landing/welcome";
import { useEffect } from "react";
import { useAppSelector } from "@/lib/hooks";

export default function Home() {
    const theme = useAppSelector((state) => state.configuration.theme);
    useEffect(() => {
        document.title = "Kawori";
    }, []);
    return (
        <>
            <div className={styles["section"]}>
                <Image
                    alt="Kawori Logo"
                    src={LogoKawori}
                    className={`${styles["logo-image"]} ${styles[theme]}`}
                    width={500}
                />
                <UserPanel />
            </div>
            <Divider />
            <News />
            <Divider />
            <Welcome />
            <Facetexture theme={theme} />
            <Divider />
            <FAQ />
            <Divider />
        </>
    );
}
