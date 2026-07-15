"use client";
import { Alert, Breadcrumb, Button, Result, Space, message } from "antd";
import * as Sentry from "@sentry/nextjs";
import { useEffect, useState } from "react";

import { setSelectedMenu } from "@/lib/features/auth";
import { useAppDispatch } from "@/lib/hooks";
import { exportFacetextureData } from "@/services/facetexture/export";
import { FACETEXTURE_MESSAGE_REF } from "@/util";
import Styles from "./Facetexture.module.scss";

const BDO_APP_URL = process.env.NEXT_PUBLIC_BDO_APP_URL;

function FaceTexture() {
    const dispatch = useAppDispatch();
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        document.title = "Kawori Facetexture";
        dispatch(setSelectedMenu(["facetexture"]));
    }, [dispatch]);

    const handleExport = async () => {
        if (exporting) {
            return;
        }
        setExporting(true);
        message.loading({ content: "Exportando seus dados", key: FACETEXTURE_MESSAGE_REF });
        try {
            await exportFacetextureData();
            message.success({ content: "Dados exportados!", key: FACETEXTURE_MESSAGE_REF });
        } catch (reason) {
            message.error({ content: "Falhou em exportar!", key: FACETEXTURE_MESSAGE_REF });
            console.error(reason);
            Sentry.captureException(reason);
        } finally {
            setExporting(false);
        }
    };

    return (
        <>
            <Breadcrumb
                className={Styles["breadcrumb"]}
                items={[{ href: "/", title: "Home" }, { title: "Kawori" }, { title: "Facetexture" }]}
            />
            <Result
                status="info"
                title="A ferramenta de Facetexture mudou de casa"
                subTitle="O editor de facetexture agora vive em um aplicativo dedicado. Esta tela serve apenas para você exportar seus dados e migrar."
                extra={
                    <Space direction="vertical" size="large" style={{ width: "100%" }}>
                        <Alert
                            type="warning"
                            showIcon
                            message="Exporte antes de continuar"
                            description="Suas imagens de rosto e o background ficam salvos apenas neste navegador. Exporte o arquivo e importe-o no aplicativo novo para não perder nada."
                        />
                        <Space wrap>
                            <Button type="primary" loading={exporting} onClick={handleExport}>
                                Exportar meus dados
                            </Button>
                            <Button
                                href={BDO_APP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                disabled={!BDO_APP_URL}
                            >
                                Abrir o aplicativo novo
                            </Button>
                        </Space>
                    </Space>
                }
            />
        </>
    );
}

export default FaceTexture;
