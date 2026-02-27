import React from "react";
import { render, screen } from "@testing-library/react";

import News from "./index";

// Mock NewsList to keep this test focused on the News wrapper logic
jest.mock("./newsList", () => ({ data }: any) => (
    <div>{data.map((item: any) => <div key={item.url}>{item.title}</div>)}</div>
));

const mockData = [
    {
        first_publication_date: "2023-01-01",
        url: "https://example.com/news1",
        title: "News 1",
    },
    {
        first_publication_date: "2023-01-02",
        url: "https://example.com/news2",
        title: "News 2",
    },
];

describe("News Component", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("renders loading state when status is loading", () => {
        render(<News data={[]} status="loading" />);
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    test("displays 'No news available' when there is no news data", () => {
        render(<News data={[]} status="success" />);
        expect(screen.getByText(/no news available/i)).toBeInTheDocument();
    });

    test("renders news items when data is provided", () => {
        render(<News data={mockData} status="success" />);
        expect(screen.getByText("News 1")).toBeInTheDocument();
        expect(screen.getByText("News 2")).toBeInTheDocument();
    });

    test("does not render news items in loading state", () => {
        render(<News data={mockData} status="loading" />);
        expect(screen.queryByText("News 1")).not.toBeInTheDocument();
    });
});
