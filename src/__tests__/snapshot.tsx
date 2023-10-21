import { render } from "@testing-library/react";
import Cards from "@/components/overview/cards";

it("renders overview cards", () => {
    const { container } = render(
        <Cards
            loading={false}
            amountPayment={1508.15}
            amountPaymentClosed={2718.15}
            amountPaymentOpen={1508.15}
            countPayment={1508.15}
        />,
    );
    expect(container).toMatchSnapshot();
});
