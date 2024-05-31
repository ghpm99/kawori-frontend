"use client";
import { useAppDispatch } from "@/lib/hooks";
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
import { useEffect } from "react";
import { Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const Rank = () => {
    const dispatch = useAppDispatch();

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
            <div></div>
        </div>
    );
};

export default Rank;
