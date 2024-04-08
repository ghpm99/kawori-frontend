import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { isFilled, asLink } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { components } from "@/slices/index";
import { createClient } from "prismicio";

import styles from "./Home.module.scss";
import MenuHeader from "@/components/menuHeader";
import { Footer } from 'antd/lib/layout/layout'

type Params = { uid: string };

export default function Page({ page }: InferGetStaticPropsType<typeof getStaticProps>) {
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
                    <SliceZone slices={page.data.slices} components={components} />
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

export async function getStaticProps({ params, previewData }: GetStaticPropsContext<Params>) {
    // The `previewData` parameter allows your app to preview
    // drafts from the Page Builder.
    const client = createClient({ previewData });

    const page = await client.getByUID("platform_news_1", params!.uid);

    return {
        props: { page },
    };
}

export async function getStaticPaths() {
    const client = createClient();

    const pages = await client.getAllByType("platform_news_1");

    return {
        paths: pages.map((page) => {
            return asLink(page);
        }),
        fallback: false,
    };
}
