import { fireEvent, screen, waitFor } from "@testing-library/react";
import OpenModalNewContract from "@/components/financial/contracts/openModalNewContract";
import { renderWithProviders } from "@/util/test-utils";
import "@testing-library/jest-dom";
import { store } from "@/lib/store";

describe("Open Modal New Contract", () => {
    test("Render button new modal", () => {
        const { baseElement } = renderWithProviders(<OpenModalNewContract />);
        expect(baseElement).toBeInTheDocument();
    });
    test("Check modal visible change", () => {
        const changeVisibleContractsModalMock = jest.fn();
        jest.mock("@/lib/features/financial/contract", () => ({
            changeVisibleContractsModal: changeVisibleContractsModalMock,
        }));

        renderWithProviders(<OpenModalNewContract />);

        const openModalButton = screen.getByTestId("button-open-modal");
        expect(openModalButton).toBeInTheDocument();

        fireEvent.click(openModalButton);

        expect(changeVisibleContractsModalMock).toHaveBeenCalledWith({ modal: "newPayment", visible: true });
    });
});
