import { PlusOutlined } from "@ant-design/icons";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Button,
    Checkbox,
    Image,
    Select,
    Tooltip,
    Typography,
    Upload,
} from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { RcFile } from "antd/lib/upload";
import { useSelector } from "react-redux";

import {
    deleteCharacterReducer,
    updateCharacterClassReducer,
    updateCharacterImageNameReducer,
    updateCharacterShowClassReducer,
    updateFacetextureUrlReducer,
} from "../../../../store/features/facetexture";
import { RootState, useAppDispatch } from "../../../../store/store";
import { db } from "../../../../util/db";
import Styles from "./Info.module.scss";

const { Title } = Typography;

const Info = () => {
    const facetextureStore = useSelector(
        (state: RootState) => state.facetexture,
    );
    const dispatch = useAppDispatch();

    const updateCharacterClass = (index: number | undefined, value: number) => {
        if (index == undefined) {
            return;
        }
        dispatch(
            updateCharacterClassReducer({
                index: index,
                class: value,
            }),
        );
    };

    const updateImageSelectedCharacter = (
        index: number | undefined,
        file: RcFile,
    ) => {
        if (index === undefined) {
            return;
        }
        dispatch(
            updateFacetextureUrlReducer({
                index: index,
                image: URL.createObjectURL(file),
            }),
        );
        dispatch(
            updateCharacterImageNameReducer({
                index: index,
                name: file.name,
            }),
        );
        updateImageLocal(file.name, file);
    };

    const updateImageLocal = async (name: string, file: Blob) => {
        const localImage = await db.image
            .filter((image) => image.name === name)
            .first();

        if (localImage && localImage.id) {
            db.image.update(localImage.id, { image: file });
        } else {
            db.image.add({
                name: name,
                imagem: file,
            });
        }
    };

    const deleteCharacter = (index: number | undefined) => {
        if (!index) {
            return;
        }
        dispatch(deleteCharacterReducer(index));
    };

    const updateCharacterShowClass = (
        index: number | undefined,
        event: CheckboxChangeEvent,
    ) => {
        if (!index) {
            return;
        }
        dispatch(
            updateCharacterShowClassReducer({
                index: index,
                show: event.target.checked,
            }),
        );
    };

    const selectedFacetexture =
        facetextureStore.selected !== undefined
            ? facetextureStore.facetexture[facetextureStore.selected]
            : undefined;

    return (
        <div className={Styles["character-info"]}>
            {selectedFacetexture && (
                <>
                    <div className={Styles["controllers-info"]}>
                        <Title level={4}>Propriedades</Title>
                        <Title level={5}>
                            Imagem atual do personagem
                            <Tooltip
                                title="Essa é a imagem atual do seu personagem.
                                Caso ja tenha feito upload da imagem que fica em Meus Documentos/Black Desert/Facetexture
                                e essa imagem voltou para a padrao, não se preocupe, esse é um erro conhecido e será ajustado em breve.
                            ">
                                <FontAwesomeIcon icon={faCircleInfo} />
                            </Tooltip>
                            :
                        </Title>
                        <Image
                            src={selectedFacetexture.image}
                            alt={selectedFacetexture.name}
                            width={125}
                            height={160}
                        />
                    </div>
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
                            value={selectedFacetexture?.class.id}
                            style={{
                                width: "125px",
                            }}
                            onChange={(value: number) =>
                                updateCharacterClass(
                                    facetextureStore.selected,
                                    value,
                                )
                            }
                        />
                    </div>
                    <div className={Styles["controllers-info"]}>
                        <Checkbox
                            checked={selectedFacetexture?.show}
                            onChange={(e) =>
                                updateCharacterShowClass(
                                    facetextureStore.selected,
                                    e,
                                )
                            }>
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

                        <Upload
                            listType="picture-card"
                            beforeUpload={(file) =>
                                updateImageSelectedCharacter(
                                    facetextureStore.selected,
                                    file,
                                )
                            }
                            fileList={[]}>
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                    </div>
                    <div className={Styles["controllers-info"]}>
                        <Button
                            type="primary"
                            onClick={() =>
                                deleteCharacter(facetextureStore.selected)
                            }>
                            Deletar personagem
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Info;
