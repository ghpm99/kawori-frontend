jest.mock("@/prismicio", () => ({
    createClient: jest.fn(() => ({
        getAllByType: jest.fn(),
    })),
}));

jest.mock("react", () => ({
    ...jest.requireActual("react"),
    cache: (fn: Function) => fn,
}));

import { fetchNewsFeedData } from "./news";
import { createClient } from "@/prismicio";

describe("fetchNewsFeedData", () => {
    const mockGetAllByType = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (createClient as jest.Mock).mockReturnValue({
            getAllByType: mockGetAllByType,
        });
    });

    it("deve retornar lista de notícias mapeadas do Prismic", async () => {
        const mockPrismicData = [
            {
                first_publication_date: "2024-01-15T10:00:00Z",
                url: "/news/article-1",
                data: { meta_title: "Article 1 Title" },
            },
            {
                first_publication_date: "2024-01-16T10:00:00Z",
                url: "/news/article-2",
                data: { meta_title: "Article 2 Title" },
            },
        ];

        mockGetAllByType.mockResolvedValueOnce(mockPrismicData);

        const result = await fetchNewsFeedData();

        expect(mockGetAllByType).toHaveBeenCalledWith("platform_news");
        expect(result).toEqual([
            {
                first_publication_date: "2024-01-15T10:00:00Z",
                url: "/news/article-1",
                title: "Article 1 Title",
            },
            {
                first_publication_date: "2024-01-16T10:00:00Z",
                url: "/news/article-2",
                title: "Article 2 Title",
            },
        ]);
    });

    it("deve usar '/' como url padrão quando url é null", async () => {
        const mockPrismicData = [
            {
                first_publication_date: "2024-01-15T10:00:00Z",
                url: null,
                data: { meta_title: "Article Without URL" },
            },
        ];

        mockGetAllByType.mockResolvedValueOnce(mockPrismicData);

        const result = await fetchNewsFeedData();

        expect(result[0].url).toBe("/");
    });

    it("deve retornar lista vazia quando não há notícias", async () => {
        mockGetAllByType.mockResolvedValueOnce([]);

        const result = await fetchNewsFeedData();

        expect(result).toEqual([]);
    });
});
