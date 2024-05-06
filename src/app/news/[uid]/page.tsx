"use server";
import { asLink, asText, isFilled } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";
import { GetStaticPropsContext, InferGetStaticPropsType, Metadata } from "next";
import Head from "next/head";

import { components } from "@/slices/index";

import MenuHeader from "@/components/menuHeader";
import { formatterDate } from "@/util/index";
import { Breadcrumb, List } from "antd";
import { Footer } from "antd/lib/layout/layout";
import Link from "next/link";
import styles from "@/app/Home.module.scss";
import stylesNews from "./news.module.scss";
import { createClient } from "@/prismicio";
import ListNews from "./listNews";

type Params = { uid: string };

// export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const client = createClient();
    const page = await client.getByUID("platform_news", params.uid);

    return {
        title: `${page.data.meta_title}`,
        description: page.data.meta_description,
    };
}

export default async function Page({ params }: { params: Params }) {
    const client = createClient();
    const page = await client.getByUID("platform_news", params.uid);
    const pages = await client.getAllByType("platform_news");
    const pageList = pages.map((item) => ({
        first_publication_date: item.first_publication_date,
        url: item.url,
        title: item.data.meta_title,
    }));

    return (
        <>
            <Head>
                <title>{page.data.meta_title}</title>
                {isFilled.keyText(page.data.meta_description) ? (
                    <meta name="description" content={page.data.meta_description} />
                ) : null}
            </Head>
            <div className={styles["container"]}>
                <MenuHeader />
                <div className={styles["body"]}>
                    <div className={styles["internal-page"]}>
                        <div className={styles["section"]}>
                            <div className={stylesNews["content-box"]}>
                                <div className={stylesNews["header"]}>
                                    <Breadcrumb
                                        items={[
                                            { href: "/", title: "Home" },
                                            { title: "Notícias" },
                                            { title: page.data.meta_title },
                                        ]}
                                    />
                                    <div>Publicado em: {formatterDate(page.first_publication_date)}</div>
                                </div>
                                <SliceZone slices={page.data.slices} components={components} />
                            </div>
                            <div className={stylesNews["box-floating"]}>
                                <ListNews items={pageList} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer style={{ textAlign: "center" }}>
                Sinta-se a vontade para entrar para
                <a target="_blank" href="https://discord.gg/fykNkXyn2r">
                    &nbsp;nossa comunidade&nbsp;
                </a>
                caso tenha alguma duvida ou sugestão!
            </Footer>
        </>
    );
}

export async function generateStaticParams() {
    const client = createClient();

    const pages = await client.getAllByType("platform_news");

    return pages.map((page) => {
        return { uid: page.uid };
    });
}
