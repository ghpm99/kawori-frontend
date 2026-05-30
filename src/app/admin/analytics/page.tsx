"use client";

import { Breadcrumb, Card, Col, Row, Statistic, Typography } from "antd";
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

import { setSelectedMenu } from "@/lib/features/auth";
import { useAppDispatch } from "@/lib/hooks";
import {
    IAnalyticsDashboard,
    fetchAnalyticsDashboard,
} from "@/services/analytics";
import { useTheme } from "@/components/themeProvider/themeContext";
import styles from "./Analytics.module.scss";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const { Title: AntTitle } = Typography;

const EMPTY_DASHBOARD: IAnalyticsDashboard = {
    users: { total: 0, active: 0, new_last_7_days: 0, new_last_30_days: 0, recently_active_last_30_days: 0 },
    feature_adoption: { financial: 0, bdo: 0 },
    registrations_by_month: [],
};

export default function AnalyticsPage() {
    const dispatch = useAppDispatch();
    const {
        state: { theme },
    } = useTheme();
    const [data, setData] = useState<IAnalyticsDashboard>(EMPTY_DASHBOARD);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Kawori Analytics";
        dispatch(setSelectedMenu(["analytics"]));

        fetchAnalyticsDashboard()
            .then(setData)
            .finally(() => setLoading(false));
    }, [dispatch]);

    const chartColor = theme === "dark" ? "rgba(99, 179, 237, 1)" : "rgba(66, 153, 225, 1)";
    const chartFill = theme === "dark" ? "rgba(99, 179, 237, 0.15)" : "rgba(66, 153, 225, 0.1)";

    const registrationsChart = {
        labels: data.registrations_by_month.map((r) => r.month),
        datasets: [
            {
                label: "Novos usuários",
                data: data.registrations_by_month.map((r) => r.count),
                borderColor: chartColor,
                backgroundColor: chartFill,
                fill: true,
                tension: 0.3,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top" as const },
            title: { display: false },
        },
        scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } },
        },
    };

    return (
        <>
            <Breadcrumb className={styles.breadcrumb}>
                <Breadcrumb.Item>Kawori</Breadcrumb.Item>
                <Breadcrumb.Item>Analytics</Breadcrumb.Item>
            </Breadcrumb>

            <div className={styles["metrics-section"]}>
                <AntTitle level={5} className={styles["section-title"]}>
                    Usuários
                </AntTitle>
                <Row gutter={[16, 16]}>
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Card loading={loading}>
                            <Statistic title="Total cadastrados" value={data.users.total} />
                        </Card>
                    </Col>
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Card loading={loading}>
                            <Statistic title="Usuários ativos" value={data.users.active} />
                        </Card>
                    </Col>
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Card loading={loading}>
                            <Statistic title="Novos (7 dias)" value={data.users.new_last_7_days} />
                        </Card>
                    </Col>
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Card loading={loading}>
                            <Statistic title="Novos (30 dias)" value={data.users.new_last_30_days} />
                        </Card>
                    </Col>
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Card loading={loading}>
                            <Statistic
                                title="Ativos recentes (30d)"
                                value={data.users.recently_active_last_30_days}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            <div className={styles["metrics-section"]}>
                <AntTitle level={5} className={styles["section-title"]}>
                    Adoção de funcionalidades
                </AntTitle>
                <Row gutter={[16, 16]}>
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Card loading={loading}>
                            <Statistic
                                title="Financeiro"
                                value={data.feature_adoption.financial}
                                suffix={`/ ${data.users.active}`}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Card loading={loading}>
                            <Statistic
                                title="Black Desert (BDO)"
                                value={data.feature_adoption.bdo}
                                suffix={`/ ${data.users.active}`}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            <Card
                className={styles["chart-container"]}
                title="Cadastros por mês (últimos 12 meses)"
                loading={loading}
            >
                {data.registrations_by_month.length > 0 ? (
                    <Line data={registrationsChart} options={chartOptions} />
                ) : (
                    <Typography.Text type="secondary">Sem dados de cadastro no período.</Typography.Text>
                )}
            </Card>
        </>
    );
}
