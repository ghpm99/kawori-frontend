import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Checkbox, Modal, Select, Tooltip, Typography, Upload } from "antd";
import Styles from "./Characters.module.scss";
import DragAndDropCharacters from "./dragAndDrop";
import Info from "./info";
import New from "./new";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "store/store";
import { changeModalVisible } from "store/features/facetexture";
import Dragger from 'antd/es/upload/Dragger';

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
                <New />
            </div>
            <Info />
            <Modal title="Criar novo personagem" open={facetextureStore.modal.newFacetexture.visible} onCancel={() => toggleModalVisible()}>
                <div className={Styles["controllers-info"]}>
                    <Title level={5}>
                        Classe do personagem
                        <Tooltip title="Selecione a classe que voce quer que apareça no resultado final.">
                            <FontAwesomeIcon icon={faCircleInfo} />
                        </Tooltip>
                        :
                    </Title>
                    <Select
                        options={ facetextureStore.class.map(
                            item => ({
                                value: item.id,
                                label: item.name
                            })
                        ) }
                        style={{
                            width: "125px",
                        }}
                    />
                </div>
                <div className={Styles["controllers-info"]}>
                    <Checkbox>Mostrar icone da classe</Checkbox>
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

                    <Dragger  listType="picture-card" fileList={[]}>
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                    </Dragger >
                </div>
            </Modal>
        </div>
    );
};

export default Characters;
