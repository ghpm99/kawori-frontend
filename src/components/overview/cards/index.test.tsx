import Cards from "@/components/overview/cards";
import { render, screen } from "@testing-library/react";

describe("Overview Card", () => {
    it("Render overview card", () => {
        render(
            <Cards
                loading={false}
                amountPayment={1000.0}
                amountPaymentClosed={1}
                amountPaymentOpen={1}
                countPayment={1}
            />,
        );
        expect("Total de pagamentos").toBeInTheDocument();
    });
});
