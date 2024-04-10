import { List } from "antd";
import Link from "next/link";
import styles from "./news.module.scss";
import { formatterDate } from "@/util/index";

interface NewsProps {
    first_publication_date: string;
    url: string;
    title: string;
}

const News = ({ data }) => {
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
