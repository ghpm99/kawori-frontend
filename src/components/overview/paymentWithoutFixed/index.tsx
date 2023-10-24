import React from "react";
import { Line } from "react-chartjs-2";

import { formatterMonthYearDate } from "@/util/index";
import styles from "./paymentWithoutFixed.module.scss";

interface IAccumulatedValueProps {
    payments: IPaymentCharts[];
    amountForecastValue: number;
}

export default function AccumulatedValue(props: IAccumulatedValueProps) {
    const options = {
        responsive: true,
        interaction: {
            mode: "index" as const,
            intersect: false,
        },
        stacked: false,
        plugins: {
            title: {
                display: true,
                text: "Acumulado de diferença entre debito e credito",
            },
        },
        scales: {
            y: {
                type: "linear" as const,
                display: true,
                position: "left" as const,
            },
        },
    };

    const data = {
        labels: props.payments?.map((data) => formatterMonthYearDate(data.label)),
        datasets: [
            {
                label: "Total",
                data: props.payments?.map((data) => data.accumulated),
                borderColor: "rgb(53, 162, 235)",
                backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
            {
                label: "Valor de reserva",
                data: props.payments?.map((data) => props.amountForecastValue),
                borderColor: "rgb(235, 53, 53)",
                backgroundColor: "rgba(235, 53, 53, 0.5)",
            },
        ],
    };

    return (
        <div className={styles["chart-container"]}>
            <Line data={data} options={options} width={400} height={200} style={{ background: "white" }} />
        </div>
    );
}
