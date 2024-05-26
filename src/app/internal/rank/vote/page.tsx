"use client";
import { Breadcrumb, Button, Card, Layout } from "antd";

import Styles from "./vote.module.scss";

import Question from "@/components/rank/question";
import { setSelectedMenu } from "@/lib/features/auth";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getAllQuestions } from "@/services/classification";
import { useEffect, useState } from "react";
import Intro from "@/components/rank/intro";
import styles from "./vote.module.scss";

const RANK_MESSAGE_REF: string = "rank-message-ref";

const desc = ["Horrivel", "Mal", "Normal", "Bom", "Perfeito"];

function Vote() {
    const dispatch = useAppDispatch();
    const questionsStore = useAppSelector((state) => state.classification.questions);

    const [activePanel, setActivePanel] = useState(0);

    useEffect(() => {
        document.title = "Kawori Rank - Votar";
        dispatch(setSelectedMenu(["rank"]));
        dispatch(getAllQuestions());
    }, []);

    const nextQuestion = () => {
        if (activePanel === questionsStore.length) {
            return;
        }
        setActivePanel((prev) => ++prev);
    };

    const previousQuestion = () => {
        if (activePanel === 0) {
            return;
        }
        setActivePanel((prev) => --prev);
    };

    const hasNext = activePanel < questionsStore.length;
    const hasPrevious = activePanel > 0;

    return (
        <>
            <Breadcrumb className={Styles["breadcrumb"]}>
                <Breadcrumb.Item>Kawori</Breadcrumb.Item>
                <Breadcrumb.Item>Rank de classes</Breadcrumb.Item>
            </Breadcrumb>
            <div className={Styles["container-toolkit"]}>
                <Layout>
                    {activePanel === 0 && (
                        <div>
                            <Intro nextQuestion={nextQuestion} />
                        </div>
                    )}

                    {questionsStore.map((question, index) => (
                        <div key={question.id}>
                            {activePanel === index + 1 && (
                                <Question
                                    question={question}
                                    text={desc}
                                    hasNext={hasNext}
                                    hasPrevious={hasPrevious}
                                    nextQuestion={nextQuestion}
                                    previousQuestion={previousQuestion}
                                />
                            )}
                        </div>
                    ))}
                </Layout>
            </div>
        </>
    );
}

export default Vote;
