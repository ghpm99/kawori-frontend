import { useEffect } from "react";
import { Bar } from "react-chartjs-2";

import styles from "./invoiceByTag.module.scss";

interface IInvoiceByTagProps {
    data: IInvoiceByTag[];
}

const InvoiceByTag = ({ data }: IInvoiceByTagProps) => {
    const dataset = data.map((item) => ({
        label: item.name,
        data: [item.amount],
        backgroundColor: item.color,
    }));

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Valores por tag",
            },
        },
    };

    const dataSource = {
        labels: ["Tag"],
        datasets: dataset,
    };

    return (
        <div className={styles["chart-container"]}>
            <Bar data={dataSource} options={options} width={400} style={{ background: "white", height: "100%" }} />
        </div>
    );
};

export default InvoiceByTag;
