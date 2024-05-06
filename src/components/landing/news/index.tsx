"use server";

import { createClient } from "@/prismicio";
import styles from "./news.module.scss";
import NewsList from "./newsList";

export interface NewsProps {
    first_publication_date: string;
    url: string;
    title: string;
}

async function create() {
    const client = createClient();

    const page = await client.getAllByType("platform_news");

    const pageList = page.map((item) => ({
        first_publication_date: item.first_publication_date,
        url: item.url ?? "/",
        title: item.data.meta_title,
    }));

    return pageList;
}

const News = async () => {
    const data: NewsProps[] = await create();
    return (
        <div className={styles["news-list"]}>
            <NewsList data={data} />
        </div>
    );
};

export default News;
