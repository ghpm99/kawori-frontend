import AccountMenuInfo from "@/components/accountMenuInfo/index";
import { fireEvent, render } from "@testing-library/react";
import { signOut } from "next-auth/react";

jest.mock("next-auth/react");

describe("AccountMenuInfo", () => {
    const user = {
        name: "Test User",
        email: "",
        avatar: "",
    };

    it("should render the user name", () => {
        const { getByText } = render(<AccountMenuInfo user={user} />);

        expect(getByText(user.name)).toBeInTheDocument();
    });

    it("should render the account link", () => {
        const { getByText } = render(<AccountMenuInfo user={user} />);

        expect(getByText("Conta")).toBeInTheDocument();
    });

    it("should call signOut when 'Sair' is clicked", () => {
        const { getByText } = render(<AccountMenuInfo user={user} />);

        fireEvent.click(getByText("Sair"));

        expect(signOut).toHaveBeenCalled();
    });
});
