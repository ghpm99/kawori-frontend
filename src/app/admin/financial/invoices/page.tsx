"use client";
import { SearchOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Layout, Table, Tag, Typography } from "antd";

import Link from "next/link";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import LoadingPage from "@/components/loadingPage/Index";
import { fetchAllInvoice } from "@/lib/features/financial/invoice";
import { useAppDispatch } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { formatMoney, formatterDate } from "@/util/index";
import styles from "./Invoices.module.scss";
import { setSelectedMenu } from "@/lib/features/auth";

const { Title } = Typography;

function FinancialPage() {
    const financialStore = useSelector((state: RootState) => state.financial.invoice);
    const dispatch = useAppDispatch();

    useEffect(() => {
        document.title = "Kawori Notas";
        dispatch(setSelectedMenu(["financial", "invoices"]));

        dispatch(
            fetchAllInvoice({
                page: 1,
                page_size: 20,
                status: 0,
            }),
        );
    }, []);

    const onChangePagination = (page: number, pageSize: number) => {
        dispatch(
            fetchAllInvoice({
                ...financialStore.filters,
                page: page,
                page_size: pageSize,
            }),
        );
    };

    const headerTableFinancial = [
        {
            title: "Id",
            dataIndex: "id",
            key: "id",
            render: (value: any) => <Link href={`/admin/financial/invoices/details/${value}`}>{value}</Link>,
        },
        {
            title: "Nome",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Valor",
            dataIndex: "value",
            key: "value",
            render: (value: any) => formatMoney(value),
        },
        {
            title: "Baixado",
            dataIndex: "value_closed",
            key: "value_closed",
            render: (value: any) => formatMoney(value),
        },
        {
            title: "Em aberto",
            dataIndex: "value_open",
            key: "value_open",
            render: (value: any) => formatMoney(value),
        },
        {
            title: "Parcelas",
            dataIndex: "installments",
            key: "installments",
        },
        {
            title: "Dia",
            dataIndex: "date",
            key: "date",
            render: (value: any) => formatterDate(value),
        },
        {
            title: "Tags",
            dataIndex: "tags",
            key: "tags",
            render: (_: any, { tags }: IInvoicePagination) => (
                <>
                    {tags.map((tag) => (
                        <Tag color={tag.color} key={`invoice-tags-${tag.id}`}>
                            {tag.name}
                        </Tag>
                    ))}
                </>
            ),
        },
        {
            title: "Ações",
            dataIndex: "id",
            key: "id",
            render: (value: any) => <Link href={`/admin/financial/invoices/details/${value}`}>Detalhes</Link>,
        },
    ];

    return (
        <>
            <Breadcrumb className={styles.breadcrumb}>
                <Breadcrumb.Item>Kawori</Breadcrumb.Item>
                <Breadcrumb.Item>Financeiro</Breadcrumb.Item>
                <Breadcrumb.Item>Em aberto</Breadcrumb.Item>
            </Breadcrumb>
            <Layout>
                <div className={styles.header_command}>
                    <Title level={3} className={styles.title}>
                        Valores em aberto
                    </Title>
                    <div>
                        <Button icon={<SearchOutlined />}>Filtrar</Button>
                    </div>
                </div>
                <Table
                    pagination={{
                        showSizeChanger: true,
                        defaultPageSize: financialStore.filters.page_size,
                        current: financialStore.pagination.currentPage,
                        total: financialStore.pagination.totalPages * financialStore.filters.page_size,
                        onChange: onChangePagination,
                    }}
                    columns={headerTableFinancial}
                    dataSource={financialStore.data}
                    loading={financialStore.loading}
                    summary={(invoiceData) => <TableSummary invoiceData={invoiceData} />}
                />
            </Layout>
        </>
    );
}

function TableSummary({ invoiceData }: { invoiceData: readonly IInvoicePagination[] }) {
    const { Text } = Typography;

    let total = 0;
    let totalOpen = 0;
    let totalClosed = 0;
    invoiceData.forEach((invoice) => {
        total = total + invoice.value;
        totalOpen = totalOpen + invoice.value_open;
        totalClosed = totalClosed + invoice.value_closed;
    });

    return (
        <>
            <Table.Summary.Row>
                <Table.Summary.Cell index={0}>
                    <Text>Total: {formatMoney(total)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                    <Text>Em aberto: {formatMoney(totalOpen)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                    <Text>Baixado: {formatMoney(totalClosed)}</Text>
                </Table.Summary.Cell>
            </Table.Summary.Row>
        </>
    );
}

FinancialPage.auth = {
    role: "admin",
    loading: <LoadingPage />,
    unauthorized: "/signin",
};

export default FinancialPage;
