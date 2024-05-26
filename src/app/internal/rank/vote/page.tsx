"use client";
import { Breadcrumb, Layout, Rate } from "antd";

import Styles from "./vote.module.scss";

import { setSelectedMenu } from "@/lib/features/auth";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getAllQuestions } from "@/services/classification";
import { useEffect, useState } from "react";
import Question from "@/components/rank/question";

const RANK_MESSAGE_REF = "rank-message-ref";

const desc = ["Horrivel", "Mal", "Normal", "Bom", "Perfeito"];

function Vote() {
    const dispatch = useAppDispatch();
    const questionsStore = useAppSelector((state) => state.classification.questions);

    useEffect(() => {
        document.title = "Kawori Rank - Votar";
        dispatch(setSelectedMenu(["rank"]));
        dispatch(getAllQuestions());
    }, []);

    return (
        <>
            <Breadcrumb className={Styles["breadcrumb"]}>
                <Breadcrumb.Item>Kawori</Breadcrumb.Item>
                <Breadcrumb.Item>Rank de classes</Breadcrumb.Item>
            </Breadcrumb>
            <div className={Styles["container-toolkit"]}>
                <Layout>
                    {questionsStore.map((question) => (
                        <div key={question.id}>
                            <Question question={question} text={desc} />
                        </div>
                    ))}
                </Layout>
            </div>
        </>
    );
}

export default Vote;
