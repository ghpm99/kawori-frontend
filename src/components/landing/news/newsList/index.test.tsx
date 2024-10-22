import { render, screen } from "@testing-library/react";
import NewsList from "./index";
import { NewsProps } from "..";
import "@testing-library/jest-dom";
import { formatterDate } from "@/util";
import Link from "next/link";

jest.mock("next/link", () => {
    return ({ children }) => children;
});

jest.mock("@/util", () => ({
    formatterDate: jest.fn((date) => date),
}));

const mockData: NewsProps[] = [
    {
        title: "Test News 1",
        url: "/news/test-news-1",
        first_publication_date: "2023-01-01",
    },
    {
        title: "Test News 2",
        url: "/news/test-news-2",
        first_publication_date: "2023-02-01",
    },
];

describe("NewsList Component", () => {
    test("renders the list header", () => {
        render(<NewsList data={mockData} />);
        expect(screen.getByText("Novidades")).toBeInTheDocument();
    });

    test("renders the news items", () => {
        render(<NewsList data={mockData} />);
        mockData.forEach((item) => {
            expect(
                screen.getByText(`[${formatterDate(item.first_publication_date)}] - ${item.title}`),
            ).toBeInTheDocument();
        });
    });

    test("renders the correct links", () => {
        render(<NewsList data={mockData} />);
        mockData.forEach((item) => {
            const linkElement = screen
                .getByText(`[${formatterDate(item.first_publication_date)}] - ${item.title}`)
                .closest("a");
            expect(linkElement).toHaveAttribute("href", item.url);
        });
    });
});
