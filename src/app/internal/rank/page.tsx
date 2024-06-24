"use client";
import { Breadcrumb, Layout, Rate, Table } from "antd";

import Loading from "@/components/facetexture/loading";
import Styles from "./rank.module.scss";

import { setSelectedMenu } from "@/lib/features/auth";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getAllAnswers } from "@/services/classification";
import Link from "next/link";
import { useEffect } from "react";
import { formatterDetailedDate } from "@/util";

const RANK_MESSAGE_REF = "rank-message-ref";

function Rank() {
    const dispatch = useAppDispatch();
    const classificationStore = useAppSelector((state) => state.classification);

    useEffect(() => {
        document.title = "Kawori Rank";
        dispatch(setSelectedMenu(["rank"]));
        dispatch(getAllAnswers());
    }, []);

    const combatStyleText = (combatStyle: number) => {
        switch (combatStyle) {
            case 1:
                return "Despertar";
            case 2:
                return "Sucessão";
            default:
                return "Desconhecido";
        }
    };

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
                        <Link className={Styles["hiper-link"]} href="/internal/rank/vote">
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
                                title: "Voto",
                                dataIndex: "vote",
                                key: "vote",
                                render: (vote) => {
                                    return <Rate disabled value={vote} />;
                                },
                            },
                            {
                                title: "Classe",
                                dataIndex: "bdo_class",
                                key: "bdo_class",
                                render: (bdo_class, object) => {
                                    return (
                                        <div>
                                            {bdo_class} - {combatStyleText(object.combat_style)}
                                        </div>
                                    );
                                },
                            },
                            {
                                title: "Dia do voto",
                                dataIndex: "created_at",
                                key: "created_at",
                                render: (value) => {
                                    return <div>{formatterDetailedDate(value)}</div>;
                                },
                            },
                        ]}
                        dataSource={classificationStore.answers}
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
