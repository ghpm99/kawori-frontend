
import { isFilled } from "@prismicio/client"
import { SliceZone } from "@prismicio/react"
import { Metadata } from "next"
import Head from "next/head"

import { components } from "@/slices/index"

import styles from "@/app/Home.module.scss"
import MenuHeader from "@/components/menuHeader"
import { createClient } from "@/prismicio"
import { formatterDate } from "@/util/index"
import { Breadcrumb } from "antd"
import { Footer } from "antd/lib/layout/layout"
import ListNews from "./listNews"
import stylesNews from "./news.module.scss"

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
