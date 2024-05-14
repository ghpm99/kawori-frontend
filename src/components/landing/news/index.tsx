

import { createClient } from "@/prismicio"
import styles from "./news.module.scss"
import NewsList from "./newsList"
import { fetchProjectDetailData } from '@/app/api/lib/news'
import { useEffect, useState } from 'react'

export interface NewsProps {
    first_publication_date: string;
    url: string;
    title: string;
}

const News = () => {

    const [data, setData] = useState<NewsProps[]>([])

    useEffect(() => {

        fetchProjectDetailData().then(response => {
            setData(response)
        })
    }, [])

    return (
        <div className={styles["news-list"]}>
            <NewsList data={data} />
        </div>
    );
};

export default News;
