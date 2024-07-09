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
import { useCallback, useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { useInView } from "react-intersection-observer";
import styles from "./rank.module.scss";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { assetsClass, AssetsClassData } from "@/util";
import Image from "next/image";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const Rank = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const dispatch = useAppDispatch();
    const configurationStore = useAppSelector((state) => state.configuration);
    const classificationStore = useAppSelector((state) => state.classification);
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

    const classIdParams = searchParams.get("classId");

    useEffect(() => {
        document.title = "Kawori Rank";
        dispatch(getAllBdoClass());
        dispatch(getTotalVotes());
        dispatch(getAnswerByClass());
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

    const classImages = assetsClass(selectedClass?.name || "");

    return (
        <div>
            <Statistic title="Total de votos" value={classificationStore.totalVotes} />
            <div className={styles["votes-pie"]}>
                <Pie data={dataSource} options={options} width={400} style={{ background: "white", height: "100%" }} />
            </div>
            {selectedClass && (
                <div className={styles["selected-class"]}>
                    <h2>{selectedClass.abbreviation}</h2>
                    <div className={styles["awakening"]}>
                        <h3>DESPERTAR</h3>
                        <Image src={classImages.awakeningImage} alt="awakening" height={920} width={2000} />
                    </div>
                    <div className={styles["succession"]}>
                        <h3>SUCESSÃO</h3>
                        <Image src={classImages.successionImage} alt="succession" height={920} width={2000} />
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
                            <div className={`${styles["bdo-class-image"]} ${styles[`character-${bdoClass.id}`]}`} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Rank;
