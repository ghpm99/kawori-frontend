"use client";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getAllBdoClass, getAnswerByClass, getAnswerSummary, getTotalVotes } from "@/services/classification";
import { normalizeString } from "@/util";
import { Rate, Statistic, Tooltip } from "antd";
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip as ChartTooltip,
} from "chart.js";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { useInView } from "react-intersection-observer";
import styles from "./rank.module.scss";
import { AnswerSummaryData } from "@/lib/features/classification";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    ChartTooltip,
    Legend,
);

const Rank = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const dispatch = useAppDispatch();
    const configurationStore = useAppSelector((state) => state.configuration);
    const classificationStore = useAppSelector((state) => state.classification);
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

    const [answerSummary, setAnswerSummary] = useState<AnswerSummaryData | undefined>(undefined);

    const classIdParams = searchParams.get("classId");

    useEffect(() => {
        document.title = "Kawori Rank";
        dispatch(getAllBdoClass());
        dispatch(getTotalVotes());
        dispatch(getAnswerByClass());
        dispatch(getAnswerSummary());
    }, []);

    useEffect(() => {
        const classId = parseInt(classIdParams);
        if (Number.isNaN(classId)) {
            return;
        }
        setSelectedClassId(classId);
    }, [classIdParams]);

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);

            return params.toString();
        },
        [searchParams],
    );

    const classWithVotesList = classificationStore.votesByClass.filter((item) => item.data > 0);

    const dataset = [
        {
            label: "# Total de voto por classe",
            data: classWithVotesList.map((item) => item.data),
            backgroundColor: classWithVotesList.map((item) => item.color),
        },
    ];

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Votos por classe",
            },
        },
    };

    const dataSource = {
        labels: classWithVotesList.map((item) => item.label),
        datasets: dataset,
    };

    const { ref, inView, entry } = useInView({
        /* Optional options */
        threshold: 0,
        delay: 2,
    });

    const selectedClass = configurationStore.class.find((bdoClass) => bdoClass.id === selectedClassId);

    const normalizedName = normalizeString(selectedClass?.name || "");

    useEffect(() => {
        if (selectedClass) {
            setAnswerSummary(classificationStore.answerSummary.find((item) => item.bdo_class === selectedClass.id));
        } else {
            setAnswerSummary(undefined);
        }
    }, [selectedClass]);

    const awakeningAnswerSummary = (() => {
        if (!answerSummary || !answerSummary.resume["1"]) {
            return;
        }
        const resume = answerSummary.resume["1"];
        return resume.map((item, index) => (
            <Tooltip key={index} title={item.details}>
                <div className={styles["answer-container"]}>
                    <div>{item.text}</div>
                    <Rate disabled value={item.avg_votes} tooltips={[String(item.avg_votes)]} allowHalf />
                </div>
            </Tooltip>
        ));
    })();

    const successionAnswerSummary = (() => {
        if (!answerSummary || !answerSummary.resume["2"]) {
            return;
        }
        const resume = answerSummary.resume["2"];
        return resume.map((item, index) => (
            <Tooltip key={index} title={item.details}>
                <div className={styles["answer-container"]}>
                    <div>{item.text}</div>
                    <Rate disabled value={item.avg_votes} />
                </div>
            </Tooltip>
        ));
    })();

    return (
        <div>
            <Statistic title="Total de votos" value={classificationStore.totalVotes} />
            <div className={styles["votes-pie"]}>
                <Pie data={dataSource} options={options} width={400} style={{ background: "white", height: "100%" }} />
            </div>
            {selectedClass && (
                <div className={styles["selected-class"]}>
                    <h2
                        className={styles["title"]}
                        style={{
                            color: selectedClass.color,
                        }}
                    >
                        {selectedClass.abbreviation}
                    </h2>
                    <div className={`${styles["awakening"]}  ${styles[normalizedName]}`}>
                        <div className={styles["grid-container"]}>
                            <div className={styles["left-container"]}></div>
                            <div className={styles["rigth-container"]}>
                                <h3
                                    className={styles["title"]}
                                    style={{
                                        color: selectedClass.color,
                                    }}
                                >
                                    DESPERTAR
                                </h3>
                                {awakeningAnswerSummary && <div>{awakeningAnswerSummary}</div>}
                            </div>
                        </div>
                    </div>
                    <div className={`${styles["succession"]}  ${styles[normalizedName]}`}>
                        <div className={styles["grid-container"]}>
                            <div className={styles["left-container"]}>
                                <h3
                                    className={styles["title"]}
                                    style={{
                                        color: selectedClass.color,
                                    }}
                                >
                                    SUCESSÃO
                                </h3>
                                {successionAnswerSummary && <div>{successionAnswerSummary}</div>}
                            </div>
                            <div className={styles["rigth-container"]}></div>
                        </div>
                    </div>
                </div>
            )}
            <div className={styles["bdo-class-title"]}>
                <h2>Escolher Classe</h2>
                <h4 className={styles["subtitle"]}>Escolha a classe para visualizar resultados dos votos</h4>
            </div>
            <ul className={`${styles["bdo-class-list"]} ${inView ? styles["on"] : undefined}`} ref={ref}>
                {configurationStore.class.map((bdoClass, index) => (
                    <li
                        key={bdoClass.id}
                        className={styles["bdo-class"]}
                        style={{
                            transitionDelay: `${index * 0.08}s`,
                        }}
                    >
                        <div
                            onClick={() => {
                                router.push(pathname + "?" + createQueryString("classId", bdoClass.id.toString()));
                            }}
                            className={styles["class-wrap"]}
                        >
                            <div className={styles["bdo-class-name"]}>{bdoClass.abbreviation}</div>
                            <div className={`${styles["bdo-class-image"]} ${styles[normalizeString(bdoClass.name)]}`} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Rank;
