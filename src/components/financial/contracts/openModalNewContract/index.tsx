import { changeVisibleContractsModal } from "@/lib/features/financial/contract";
import { useAppDispatch } from '@/lib/hooks'

import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

const OpenModalNewContract = () => {
    const dispatch = useAppDispatch();

    const openModal = (modal: keyof IModalContracts) => {
        dispatch(changeVisibleContractsModal({ modal: modal, visible: true }));
    };
    return (
        <div>
            <Button icon={<PlusOutlined />} onClick={() => openModal("newPayment")}>
                Novo
            </Button>
        </div>
    );
};

export default OpenModalNewContract;
