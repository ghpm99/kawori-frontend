import { Breadcrumb, Layout, message } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import Background from "../../../components/facetexture/background";
import Characters from "../../../components/facetexture/characters";
import Loading from "../../../components/facetexture/loading";
import Preview from "../../../components/facetexture/preview";
import LoginHeader from "../../../components/loginHeader/Index";
import MenuAdmin from "../../../components/menuAdmin/Index";
import { IFacetextureCharacterApi } from "../../../services/facetexture";
import {
    fetchFacetexture,
    updateBackgroundReducer,
    updateFacetextureUrlReducer,
} from "../../../store/features/facetexture";
import { RootState, useAppDispatch } from "../../../store/store";
import { db } from "../../../util/db";
import Styles from "./Facetexture.module.scss";

const { Header, Content } = Layout;
export const FACETEXTURE_MESSAGE_REF = "facetexture-message-ref";

function FaceTexture() {
    const router = useRouter();

    const dispatch = useAppDispatch();
    const facetextureStore = useSelector(
        (state: RootState) => state.facetexture,
    );

    useEffect(() => {
        updateBackground();
        dispatch(fetchFacetexture()).then((action) => {
            const payload = action.payload as {
                characters: IFacetextureCharacterApi[];
                classes: {
                    class: {
                        id: number;
                        name: string;
                        abbreviation: string;
                        class_image: string;
                    }[];
                };
            };
            payload.characters.forEach((value, index) => {
                updateCharacterImage(value.id, value.name);
            });
        });
    }, []);

    const updateBackground = async () => {
        const background = (await db.background.toArray())[0];

        let backgroundImage;

        if (background) {
            backgroundImage = URL.createObjectURL(background.image);
        } else {
            backgroundImage = "/media/background.jpg";
            const blob = await fetch(backgroundImage).then((r) => r.blob());
            await db.background.add({
                image: blob,
            });
        }
        dispatch(updateBackgroundReducer(backgroundImage));
    };

    const updateCharacterImage = async (index: number, name: string) => {
        const image = await db.image.where("name").equals(name).first();
        if (image) {
            const imageUrl = URL.createObjectURL(image.imagem);
            dispatch(
                updateFacetextureUrlReducer({
                    id: index,
                    image: imageUrl,
                }),
            );
        }
    };

    useEffect(() => {
        if (facetextureStore.loading) {
            message.loading({
                content: "Carregando",
                key: FACETEXTURE_MESSAGE_REF,
            });
        } else {
            message.success({
                content: "Carregado!",
                key: FACETEXTURE_MESSAGE_REF,
            });
        }
    }, [facetextureStore.loading]);

    if (facetextureStore.loading) {
        return <Loading />;
    }

    return (
        <Layout className={Styles["container"]}>
            <MenuAdmin selected={["facetexture"]} />
            <Layout>
                <Header className={Styles["header"]}>
                    <LoginHeader />
                </Header>
                <Content>
                    <Breadcrumb className={Styles["breadcrumb"]}>
                        <Breadcrumb.Item>Kawori</Breadcrumb.Item>
                        <Breadcrumb.Item>Facetexture</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className={Styles["help-text"]}>
                        Perdido? Precisa de ajuda? Assista agora o{" "}
                        <a target="_blank" href="https://youtu.be/_el6fCfvzXQ">
                            <strong>guia em video</strong>
                        </a>{" "}
                        ou entre em{" "}
                        <a target="_blank" href="https://discord.gg/fykNkXyn2r">
                            <strong>nosso discord.</strong>
                        </a>
                    </div>
                    <div className={Styles["container-toolkit"]}>
                        <Characters />
                        <Background />
                        <Preview />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}

FaceTexture.auth = {
    role: "user",
    loading: <Loading />,
    unauthorized: "/signin",
};

export default FaceTexture;
