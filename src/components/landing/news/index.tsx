import { List } from "antd";
import Link from "next/link";
import styles from "./news.module.scss";
import { formatterDate } from "@/util/index";
import { createClient } from "@/prismicio";

interface NewsProps {
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
    const data = await create();
    return (
        <div className={styles["news-list"]}>
            <List
                header={<strong>Novidades</strong>}
                bordered
                dataSource={data}
                renderItem={(item: NewsProps) => (
                    <List.Item>
                        <Link href={item.url}>
                            [{formatterDate(item.first_publication_date)}]{" - "}
                            {item.title}
                        </Link>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default News;
