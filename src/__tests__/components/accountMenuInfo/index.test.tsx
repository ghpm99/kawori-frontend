import AccountMenuInfo from "@/components/accountMenuInfo/index";
import { fireEvent, render } from "@testing-library/react";


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

});
