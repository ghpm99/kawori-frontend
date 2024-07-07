"use client";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getAllBdoClass, getAnswerByClass, getTotalVotes } from "@/services/classification";
import { Statistic } from "antd";
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import Link from "next/link";
import { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { useInView } from "react-intersection-observer";
import styles from "./rank.module.scss";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const Rank = () => {
    const dispatch = useAppDispatch();
    const configurationStore = useAppSelector((state) => state.configuration);
    const classificationStore = useAppSelector((state) => state.classification);

    useEffect(() => {
        document.title = "Kawori Rank";
        dispatch(getAllBdoClass());
        dispatch(getTotalVotes());
        dispatch(getAnswerByClass());
    }, []);

    const dataset = [
        {
            label: "Votos",
            data: classificationStore.votesByClass.map((item) => item.data),
            backgroundColor: classificationStore.votesByClass.map((item) => item.backgroundColor),
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
        labels: classificationStore.votesByClass.filter((item) => item.data > 0).map((item) => item.label),
        datasets: dataset,
    };

    const { ref, inView, entry } = useInView({
        /* Optional options */
        threshold: 0,
        delay: 2,
    });

    console.log(inView, entry);
    return (
        <div>
            <Statistic title="Total de votos" value={classificationStore.totalVotes} />
            <div className={styles["votes-pie"]}>
                <Pie data={dataSource} options={options} width={400} style={{ background: "white", height: "100%" }} />
            </div>
            <div className={styles['bdo-class-title']}>
                <h2>Escolher Classe</h2>
                <h4 className={styles['subtitle']}>Escolha a classe para visualizar resultados dos votos</h4>
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
                        <Link href={`/rank/${bdoClass.name}`} className={styles["class-wrap"]}>
                            <div className={styles["bdo-class-name"]}>{bdoClass.abbreviation}</div>
                            <div className={`${styles["bdo-class-image"]} ${styles[`character-${bdoClass.id}`]}`} />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Rank;
