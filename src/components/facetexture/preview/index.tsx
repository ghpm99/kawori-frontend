import { DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { saveAs } from "file-saver";
import { useState } from "react";

import { downloadFacetextureService, previewFacetextureService } from "../../../services/facetexture";
import { db } from "../../../util/db";
import Styles from "./Preview.module.scss";

const Preview = () => {
    const [previewBackground, setPreviewBackground] = useState();
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const updatePreviewBackground = async () => {
        if (loading) {
            return;
        }
        setLoading(true);
        const background = (await db.background.toArray())[0];
        previewFacetextureService({
            background: background.image,
        })
            .then((response) => {
                setPreviewBackground(response);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const downloadFacetexture = async () => {
        if (downloading) {
            return;
        }
        setDownloading(true);
        const background = (await db.background.toArray())[0];
        downloadFacetextureService({
            background: background.image,
        })
            .then((response) => {
                saveAs(response, "export.zip");
            })
            .finally(() => {
                setDownloading(false);
            });
    };

    return (
        <div className={Styles["preview-container"]}>
            <h1>Preview</h1>
            <div>
                <Button onClick={updatePreviewBackground} loading={loading} type="primary" className={Styles["update-button"]}>
                    Atualizar
                </Button>
                <Button
                    onClick={downloadFacetexture}
                    loading={downloading}
                    type="primary"
                    icon={<DownloadOutlined />}
                    className={Styles["download-button"]}>
                    Baixar
                </Button>
            </div>
            <div>{previewBackground && <img src={URL.createObjectURL(previewBackground)} alt={"preview-background"} />}</div>
        </div>
    );
};

export default Preview;
