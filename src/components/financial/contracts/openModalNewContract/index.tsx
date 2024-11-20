import { changeVisibleContractsModal } from "@/lib/features/financial/contract";
import { useAppDispatch, useAppStore } from "@/lib/hooks";

import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

const OpenModalNewContract = () => {
    const dispatch = useAppDispatch();

    console.log(dispatch);

    const openModal = (modal: keyof IModalContracts) => {
        console.log("clicou", changeVisibleContractsModal);
        dispatch(changeVisibleContractsModal({ modal: modal, visible: true }));
    };
    return (
        <div>
            <Button icon={<PlusOutlined />} onClick={() => openModal("newPayment")} data-testid="button-open-modal">
                Novo
            </Button>
        </div>
    );
};

export default OpenModalNewContract;
