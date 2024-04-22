import { Breadcrumb, Layout, Table } from "antd";
import { useRouter } from "next/router";

import Loading from "@/components/facetexture/loading";
import LoginHeader from "@/components/loginHeader/Index";
import MenuAdmin from "@/components/menuAdmin/Index";
import Styles from "./rank.module.scss";
import { useAppDispatch } from "@/store/store";
import { useEffect } from "react";
import { getAllAnswers } from "@/services/classification";

const { Header, Content } = Layout;
export const RANK_MESSAGE_REF = "rank-message-ref";

function Rank() {
    const router = useRouter();

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getAllAnswers());
    }, []);

    return (
        <Layout className={Styles["container"]}>
            <MenuAdmin selected={["rank"]} />
            <Layout>
                <Header className={Styles["header"]}>
                    <LoginHeader />
                </Header>
                <Content>
                    <Breadcrumb className={Styles["breadcrumb"]}>
                        <Breadcrumb.Item>Kawori</Breadcrumb.Item>
                        <Breadcrumb.Item>Rank de classes</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className={Styles["container-toolkit"]}>
                        <Layout>
                            <Table
                                title={() => "Meus ultimos votos"}
                                columns={[
                                    {
                                        title: "Questao",
                                        dataIndex: "question",
                                        key: "question",
                                    },
                                    {
                                        title: "Classe",
                                        dataIndex: "bdo_class",
                                        key: "bdo_class",
                                    },
                                    {
                                        title: "Dia do voto",
                                        dataIndex: "created_at",
                                        key: "created_at",
                                    },
                                ]}
                                dataSource={[]}
                            />
                        </Layout>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}

Rank.auth = {
    role: "user",
    loading: <Loading />,
    unauthorized: "/signin",
};

export default Rank;
