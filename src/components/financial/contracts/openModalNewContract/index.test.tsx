import { store } from "@/store/store";
import { renderWithProviders } from "@/util/test-utils";
import { screen } from "@testing-library/react";
import OpenModalNewContract from ".";

describe("Open Modal New Contract", () => {
    it("Render button new modal", () => {
        const { baseElement } = renderWithProviders(<OpenModalNewContract />);
        expect(baseElement).toBeInTheDocument();
    });
    it("Check modal visible change", () => {
        const { baseElement } = renderWithProviders(<OpenModalNewContract />);
        baseElement.click();
        return screen.findByText("Novo").then((value) => {
            value.click();
            const state = store.getState().financial.contract.modal.newPayment.visible;
            expect(state).toBeTruthy();
        });
    });
});
