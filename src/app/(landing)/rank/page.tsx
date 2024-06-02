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
import Image from "next/image";
import { useEffect } from "react";
import { Pie } from "react-chartjs-2";
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

    return (
        <div>
            <Statistic title="Total de votos" value={112893} />
            <div>
                <Pie data={dataSource} options={options} width={400} style={{ background: "white", height: "100%" }} />
            </div>
            <div className={styles["bdo-class-list"]}>
                {configurationStore.class.map((bdoClass) => (
                    <div key={bdoClass.id} className={styles["bdo-class "]}>
                        <div>{bdoClass.abbreviation}</div>
                        <Image
                            alt={bdoClass.name}
                            src={bdoClass.class_image}
                            className={styles["bdo-class-image"]}
                            sizes={"calc(100% /5)"}
                            fill
                            quality={100}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Rank;
