import { asLink, isFilled } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Head from "next/head";

import { components } from "@/slices/index";

import MenuHeader from "@/components/menuHeader";
import { formatterDate } from "@/util/index";
import { Breadcrumb, List } from "antd";
import { Footer } from "antd/lib/layout/layout";
import Link from "next/link";
import styles from "../Home.module.scss";
import stylesNews from "./news.module.scss";
import { createClient } from "@/prismicio";

type Params = { uid: string };

export default function Page({ page, pageList }: InferGetStaticPropsType<typeof getStaticProps>) {
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
                                <List
                                    style={{
                                        height: "100%",
                                    }}
                                    header={<strong>Recentes</strong>}
                                    bordered
                                    dataSource={pageList}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <Link href={item.url ?? ""}>
                                                [{formatterDate(item.first_publication_date)}]{" - "}
                                                {item.title}
                                            </Link>
                                        </List.Item>
                                    )}
                                />
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

export async function getStaticProps({ params, previewData }: GetStaticPropsContext<Params>) {
    // The `previewData` parameter allows your app to preview
    // drafts from the Page Builder.
    const client = createClient({ previewData });

    const pages = await client.getAllByType("platform_news");
    const page = await client.getByUID("platform_news", params!.uid);

    const pageList = pages.map((item) => ({
        first_publication_date: item.first_publication_date,
        url: item.url,
        title: item.data.meta_title,
    }));

    return {
        props: { page, pageList },
    };
}

export async function getStaticPaths() {
    const client = createClient();

    const pages = await client.getAllByType("platform_news");

    return {
        paths: pages.map((page) => {
            return asLink(page);
        }),
        fallback: false,
    };
}
