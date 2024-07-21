import { NextApiRequest, NextApiResponse } from "next";
import { setPreviewData, redirectToPreviewURL } from "@prismicio/next";

import { createClient } from "../../prismicio";
import { NewsProps } from "@/components/landing/news";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = createClient({ req });

    const page = await client.getAllByType("platform_news");

    const pageList: NewsProps[] = page.map((item) => ({
        first_publication_date: item.first_publication_date,
        url: item.url ?? "/",
        title: item.data.meta_title,
    }));

    return pageList;
}

export async function GET(req: NextApiRequest) {
    const client = createClient({ req });

    const page = await client.getAllByType("platform_news");

    const pageList: NewsProps[] = page.map((item) => ({
        first_publication_date: item.first_publication_date,
        url: item.url ?? "/",
        title: item.data.meta_title,
    }));

    return pageList;
}
