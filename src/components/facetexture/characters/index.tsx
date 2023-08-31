import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Tooltip, Typography } from "antd";
import { useSelector } from "react-redux";
import {
    changeModalVisible
} from "store/features/facetexture";
import { RootState, useAppDispatch } from "store/store";
import Styles from "./Characters.module.scss";
import DragAndDropCharacters from "./dragAndDrop";
import Info from "./info";
import NewModal from "./newModal";

const { Title } = Typography;
const Characters = () => {
    const dispatch = useAppDispatch();
    const facetextureStore = useSelector((state: RootState) => state.facetexture);

    const toggleModalVisible = () => {
        dispatch(changeModalVisible({ modal: "newFacetexture", visible: !facetextureStore.modal.newFacetexture.visible }));
    };

    return (
        <div className={Styles["characters"]}>
            <div>
                <Title level={4}>
                    Personagens
                    <Tooltip
                        title="Organize seus personagens clicando no + para adicionar novo e clicando e arrastando para mudar a ordem.
                        Você também pode editar as informações do personagem clicando sobre a imagem.">
                        <FontAwesomeIcon icon={faCircleInfo} />
                    </Tooltip>
                </Title>
                <Button type="primary" onClick={() => toggleModalVisible()}>
                    Incluir Novo Personagem
                </Button>
                <DragAndDropCharacters />
            </div>
            <Info />
            <NewModal toggleVisible={toggleModalVisible} />
        </div>
    );
};

export default Characters;
