import { List } from 'antd'
import styles from "./news.module.scss";
import Link from 'next/link'

const News = () => {
    return (
        <div className={styles["news-list"]}>
            <List
                header={<strong>Novidades</strong>}
                bordered
                dataSource={[
                    { text: "Novas funcionalidades!", link: "/admin/facetexture" },
                    { text: "Novidades na plataforma!", link: "/admin/user" },
                ]}
                renderItem={(item) => (
                    <List.Item>
                        <Link href={item.link}>{item.text}</Link>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default News;
