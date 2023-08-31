import { PlusOutlined } from "@ant-design/icons";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Checkbox, Modal, Select, Tooltip, Typography } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { RcFile } from "antd/lib/upload";
import Dragger from "antd/lib/upload/Dragger";
import { useSelector } from "react-redux";
import {
    changeModalVisible,
    updateFacetextureClassModalReducer,
    updateFacetextureImageNameModalReducer,
    updateFacetextureVisibleClassModalReducer,
} from "store/features/facetexture";
import { RootState, useAppDispatch } from "store/store";
import Styles from "./Characters.module.scss";
import DragAndDropCharacters from "./dragAndDrop";
import Info from "./info";
import New from "./new";

const { Title } = Typography;
const Characters = () => {
    const dispatch = useAppDispatch();
    const facetextureStore = useSelector((state: RootState) => state.facetexture);

    const toggleModalVisible = () => {
        dispatch(changeModalVisible({ modal: "newFacetexture", visible: !facetextureStore.modal.newFacetexture.visible }));
    };

    const updateCharacterClass = (value: number) => {
        dispatch(
            updateFacetextureClassModalReducer({
                classId: value,
            })
        );
    };

    const updateCharacterShowClass = (event: CheckboxChangeEvent) => {
        dispatch(
            updateFacetextureVisibleClassModalReducer({
                visible: event.target.checked,
            })
        );
    };

    const updateImageSelectedCharacter = (file: RcFile) => {
        dispatch(
            updateFacetextureImageNameModalReducer({
                name: file.name,
            })
        );
    };

    const includeNewFacetexture = () => {

    }

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
                <New />
            </div>
            <Info />
            <Modal
                title="Criar novo personagem"
                open={facetextureStore.modal.newFacetexture.visible}
                onCancel={() => toggleModalVisible()}
                onOk={includeNewFacetexture}
                confirmLoading={facetextureStore.modal.newFacetexture.saving}
                >
                <div className={Styles["controllers-info"]}>
                    <Title level={5}>
                        Classe do personagem
                        <Tooltip title="Selecione a classe que voce quer que apareça no resultado final.">
                            <FontAwesomeIcon icon={faCircleInfo} />
                        </Tooltip>
                        :
                    </Title>
                    <Select
                        options={facetextureStore.class.map((item) => ({
                            value: item.id,
                            label: item.name,
                        }))}
                        onChange={(value: number) => updateCharacterClass(value)}
                        style={{
                            width: "100%",
                        }}
                    />
                </div>
                <div className={Styles["controllers-info"]}>
                    <Checkbox
                        checked={facetextureStore.modal.newFacetexture.data.visible}
                        onChange={(e) => updateCharacterShowClass(e)}>
                        Mostrar icone da classe
                    </Checkbox>
                </div>
                <div className={Styles["controllers-info"]}>
                    <Title level={5}>
                        Facetexture do jogo
                        <Tooltip
                            title="Selecione a facetexture atual do personagem,
                                esse arquivo geralmente fica dentro da pasta Meus Documentos/Black Desert/Facetexture.
                                Essa é a imagem que aparece atualmente na sua tela de seleção de personagem.">
                            <FontAwesomeIcon icon={faCircleInfo} />
                        </Tooltip>
                        :
                    </Title>
                    <Dragger listType="picture-card" beforeUpload={(file) => updateImageSelectedCharacter(file)} fileList={[]}>
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                    </Dragger>
                    <div>
                        Nome do arquivo: {facetextureStore.modal.newFacetexture.data.name}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Characters;
