import { fetchProjectDetailData } from "@/app/api/lib/news"
import { useEffect, useState } from "react"
import styles from "./news.module.scss"
import NewsList from "./newsList"

export interface NewsProps {
    first_publication_date: string;
    url: string;
    title: string;
}

type Status = "waiting" | "loading" | "success" | "error";

const News = () => {
    const [data, setData] = useState<NewsProps[]>([]);
    const [status, setStatus] = useState<Status>("waiting");

    useEffect(() => {
        if (status !== "waiting") return;
        setStatus("loading");
        fetchProjectDetailData()
            .then((response) => {
                setData(response);
                setStatus("success");
            })
            .catch(() => {
                setStatus("error");
            });
    }, [status]);

    const loadingStatus = (() => {
        return status === "waiting" || status === "loading";
    })();

    return (
        <div className={styles["news-list"]}>
            {loadingStatus && <p>Loading...</p>}
            {!loadingStatus && data.length === 0 && <p>No news available</p>}
            {!loadingStatus && data.length > 0 && <NewsList data={data} />}
        </div>
    );
};

export default News;
