import { DownloadOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { saveAs } from "file-saver";
import { useState } from "react";

import {
    downloadFacetextureService,
    previewFacetextureService,
} from "../../../services/facetexture";
import { db } from "../../../util/db";
import Styles from "./Preview.module.scss";
import { FACETEXTURE_MESSAGE_REF } from "pages/admin/facetexture";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

const Preview = () => {
    const facetextureStore = useSelector(
        (state: RootState) => state.facetexture,
    );
    const [previewBackground, setPreviewBackground] = useState();
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const updatePreviewBackground = async () => {
        if (loading) {
            return;
        }
        message.loading({
            content: "Atualizando preview",
            key: FACETEXTURE_MESSAGE_REF,
        });
        setLoading(true);
        const background = (await db.background.toArray())[0];
        previewFacetextureService({
            background: background.image,
        })
            .then((response) => {
                message.success({
                    content: "Preview atualizado com sucesso!",
                    key: FACETEXTURE_MESSAGE_REF,
                });
                setPreviewBackground(response);
            })
            .catch((reason) => {
                message.error({
                    content: "Falhou em atualizar preview!",
                    key: FACETEXTURE_MESSAGE_REF,
                });
                console.log(reason);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const downloadFacetexture = async () => {
        if (downloading) {
            return;
        }
        message.loading({
            content: "Baixando facetextures",
            key: FACETEXTURE_MESSAGE_REF,
        });
        setDownloading(true);
        const background = (await db.background.toArray())[0];
        downloadFacetextureService({
            background: background.image,
        })
            .then((response) => {
                saveAs(response, "export.zip");
            })
            .catch((reason) => {
                message.error({
                    content: "Falhou em baixar!",
                    key: FACETEXTURE_MESSAGE_REF,
                });
                console.log(reason);
            })
            .finally(() => {
                setDownloading(false);
            });
    };

    const disableButtons = facetextureStore.facetexture.length <= 0;

    return (
        <div className={Styles["preview-container"]}>
            <h1>Preview</h1>
            <div>
                <Button
                    disabled={disableButtons}
                    onClick={updatePreviewBackground}
                    loading={loading}
                    type="primary"
                    className={Styles["update-button"]}>
                    Atualizar
                </Button>
                <Button
                    disabled={disableButtons}
                    onClick={downloadFacetexture}
                    loading={downloading}
                    type="primary"
                    icon={<DownloadOutlined />}
                    className={Styles["download-button"]}>
                    Baixar
                </Button>
            </div>
            <div>
                {previewBackground && (
                    <img
                        src={URL.createObjectURL(previewBackground)}
                        alt={"preview-background"}
                    />
                )}
            </div>
        </div>
    );
};

export default Preview;
