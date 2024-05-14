

import { createClient } from "@/prismicio"
import { NewsProps } from "@/components/landing/news"
import { cache } from "react"

export const fetchProjectDetailData = cache(async () => {
    const client = createClient();

    const page = await client.getAllByType("platform_news");

    const pageList: NewsProps[]  = page.map((item) => ({
        first_publication_date: item.first_publication_date,
        url: item.url ?? "/",
        title: item.data.meta_title,
    }));

    return pageList;
});