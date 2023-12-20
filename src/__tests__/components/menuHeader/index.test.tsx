import { render } from "@testing-library/react";
import useMenuHeader from "@/components/menuHeader/useMenuHeader";
import MenuHeader from "@/components/menuHeader/index";

jest.mock("@/components/menuHeader/useMenuHeader");

describe("MenuHeader", () => {
    it("should render the menu header with user options when authenticated", () => {
        (useMenuHeader as jest.Mock).mockReturnValue({
            status: "authenticated",
            data: {
                user: {
                    image: "test-image",
                    name: "test-name",
                    email: "test-email",
                },
            },
        });

        const { getByText } = render(<MenuHeader />);

        expect(getByText("Kawori")).toBeInTheDocument();
        expect(getByText("test-name")).toBeInTheDocument();
    });

    it("should render the menu header with login option when not authenticated", () => {
        (useMenuHeader as jest.Mock).mockReturnValue({
            status: "unauthenticated",
            data: null,
        });

        const { getByText } = render(<MenuHeader />);

        expect(getByText("Kawori")).toBeInTheDocument();
        expect(getByText("Logar")).toBeInTheDocument();
    });
});
