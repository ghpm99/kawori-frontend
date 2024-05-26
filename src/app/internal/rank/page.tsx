"use client";
import { Breadcrumb, Layout, Table } from "antd";

import Loading from "@/components/facetexture/loading";
import Styles from "./rank.module.scss";

import { setSelectedMenu } from "@/lib/features/auth";
import { useAppDispatch } from "@/lib/hooks";
import { getAllAnswers } from "@/services/classification";
import Link from "next/link";
import { useEffect } from "react";

const RANK_MESSAGE_REF = "rank-message-ref";

function Rank() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        document.title = "Kawori Rank";
        dispatch(setSelectedMenu(["rank"]));
        dispatch(getAllAnswers());
    }, []);

    return (
        <>
            <Breadcrumb className={Styles["breadcrumb"]}>
                <Breadcrumb.Item>Kawori</Breadcrumb.Item>
                <Breadcrumb.Item>Rank de classes</Breadcrumb.Item>
            </Breadcrumb>
            <div className={Styles["container-toolkit"]}>
                <Layout>
                    <div className={Styles["help-text"]}>
                        Deseja votar em alguma classe?
                        <Link href="/internal/rank/vote">
                            <strong>Clique aqui</strong>
                        </Link>
                    </div>
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
        </>
    );
}

Rank.auth = {
    role: "user",
    loading: <Loading />,
    unauthorized: "/signin",
};

export default Rank;
