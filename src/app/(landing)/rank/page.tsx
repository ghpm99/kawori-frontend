"use client";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getAllBdoClass } from "@/services/classification";
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

    useEffect(() => {
        document.title = "Kawori Rank";
        dispatch(getAllBdoClass());
    }, []);

    const dataset = [
        {
            label: "# Valor total por tag",
            data: [17],
            backgroundColor: ["#821c1c"],
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
        labels: ["bruxa"],
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
            <Statistic title="Total de votos" value={112893} />
            <div className={styles["votes-pie"]}>
                <Pie data={dataSource} options={options} width={400} style={{ background: "white", height: "100%" }} />
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
