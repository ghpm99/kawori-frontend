import {
    Breadcrumb,
    Card,
    Dropdown,
    Layout,
    Menu,
    MenuProps,
    message,
    Select,
    Table,
    Typography,
} from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import { DefaultOptionType } from "antd/lib/select";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import LoadingPage from "../../../../../components/loadingPage/Index";
import LoginHeader from "../../../../../components/loginHeader/Index";
import MenuAdmin from "../../../../../components/menuAdmin/Index";
import { saveInvoiceTagsService } from "../../../../../services/financial";
import {
    fetchInvoiceDetails,
    fetchInvoicePaymentsDetails,
    fetchTags,
} from "../../../../../store/features/financial/Index";
import { RootState, useAppDispatch } from "../../../../../store/store";
import { formatMoney, formatterDate } from "../../../../../util";
import styles from "./Details.module.scss";

const { Paragraph } = Typography;
const { Option } = Select;

export default function InvoiceDetails() {
    const msgRef = "invoice-details-msg";

    const router = useRouter();
    const { id } = router.query;

    const financialStore = useSelector(
        (state: RootState) => state.financial.invoiceDetail
    );
    const tagsStore = useSelector((state: RootState) => state.financial.tags);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchTags());
    }, []);

    useEffect(() => {
        if (id) {
            const idInvoice = parseInt(id as string);
            dispatch(fetchInvoiceDetails(idInvoice));
            dispatch(
                fetchInvoicePaymentsDetails({
                    id: idInvoice,
                    filters:{
                        page: 1,
                        page_size: 20
                    }
                })
            );
        }
    }, [id]);

    const save = (event: any) => {
        console.log(event);
    };

    const changeName = (event: any) => {
        console.log(event);
    };

    const includeNewInvoice = () => {
        console.log("includeNewInvoice");
    };

    const onMenuClick: MenuProps["onClick"] = (e) => {
        console.log("click", e);
        if (e.key === "1") {
            includeNewInvoice();
        }
    };

    const handleChangeTags = (
        value: number[],
        option: DefaultOptionType | DefaultOptionType[]
    ) => {
        console.log(`selected ${value}`, option);
        saveInvoiceTagsService(
            financialStore.data.id,
            option.map((item: any) => item.value)
        ).then(
            (response) => {
                if (response.status === 200) {
                    message.success(response.data.msg);
                }
            },
            (reason) => {
                console.log(reason);
                message.error("Falhou em atualizar tags");
            }
        );
    };

    const onChangePagination = (page: number, pageSize: number) => {
        dispatch(
            fetchInvoicePaymentsDetails({
                id: financialStore.data.id,
                filters: {
                    ...financialStore.payments.filters,
                    page: page,
                    page_size: pageSize,
                },
            })
        );
    };

    const menu = (
        <Menu
            onClick={onMenuClick}
            items={[
                {
                    key: "1",
                    label: "Incluir nova nota",
                },
            ]}
        />
    );

    return (
        <Layout className={styles.container}>
            <MenuAdmin selected={["sub2", "invoices"]} />
            <Layout>
                <Header className={styles.header}>
                    <LoginHeader />
                </Header>
                <Content>
                    <Breadcrumb className={styles.breadcrumb}>
                        <Breadcrumb.Item>Kawori</Breadcrumb.Item>
                        <Breadcrumb.Item>Financeiro</Breadcrumb.Item>
                        <Breadcrumb.Item>Nota</Breadcrumb.Item>
                        <Breadcrumb.Item>Detalhes</Breadcrumb.Item>
                    </Breadcrumb>
                    <Layout className={styles.container_labels}>
                        <Card loading={financialStore.loading}>
                            <div className={styles["row"]}>
                                <div className={styles["label-detail"]}>
                                    <div className={styles.label}>
                                        ID: {financialStore.data?.id}
                                    </div>
                                </div>
                                <div className={styles["label-detail"]}>
                                    <Link
                                        href={`/admin/financial/contracts/details/${financialStore.data?.contract}`}>
                                        <div
                                            className={styles.label}
                                            style={{ cursor: "pointer" }}>
                                            Contrato:{" "}
                                            {`${financialStore.data?.contract} - ${financialStore.data?.contract_name}`}
                                        </div>
                                    </Link>
                                </div>
                                <div className={styles["label-detail"]}>
                                    <div className={styles.label}>Nome:</div>
                                    <Paragraph
                                        style={{ margin: "0" }}
                                        editable={{ onChange: changeName }}>
                                        {financialStore.data?.name}
                                    </Paragraph>
                                </div>
                            </div>
                            <div className={styles["row"]}>
                                <div className={styles["label-detail"]}>
                                    <div className={styles.label}>
                                        <strong>Status:</strong>{" "}
                                        {financialStore.data?.status === 0
                                            ? "Em aberto"
                                            : "Baixado"}
                                    </div>
                                </div>
                                <div className={styles["label-detail"]}>
                                    <div className={styles.label}>
                                        Parcelas:{" "}
                                        {financialStore.data?.installments}
                                    </div>
                                </div>
                                <div className={styles["label-detail"]}>
                                    <div className={styles.label}>
                                        Data:{" "}
                                        {formatterDate(
                                            financialStore.data?.date
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className={styles["row"]}>
                                <div className={styles["label-detail"]}>
                                    <div className={styles.label}>
                                        Valor:{" "}
                                        {formatMoney(
                                            financialStore.data?.value
                                        )}
                                    </div>
                                </div>
                                <div className={styles["label-detail"]}>
                                    <div className={styles.label}>
                                        Valor em Aberto:{" "}
                                        {formatMoney(
                                            financialStore.data?.value_open
                                        )}
                                    </div>
                                </div>
                                <div className={styles["label-detail"]}>
                                    <div className={styles.label}>
                                        Valor Baixado:{" "}
                                        {formatMoney(
                                            financialStore.data?.value_closed
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className={styles["row"]}>
                                <div className={styles["label-detail"]}>
                                    <Select
                                        mode="tags"
                                        style={{ width: "100%" }}
                                        placeholder="Tags"
                                        onChange={handleChangeTags}
                                        defaultValue={financialStore.data?.tags.map(
                                            (item) => item.id
                                        )}>
                                        {tagsStore.data?.map((item) => (
                                            <Option
                                                key={item.id}
                                                value={item.id}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <div className={styles["row"]}>
                                <div className={styles["label-detail"]}>
                                    <div className={styles.label}>
                                        Pagamentos:
                                    </div>
                                </div>
                                <div
                                    className={`${styles["label-detail"]} ${styles["action-Button"]}`}>
                                    <Dropdown.Button
                                        overlay={menu}
                                        type="primary"
                                        onClick={save}
                                        className={styles.button_save}>
                                        Salvar
                                    </Dropdown.Button>
                                </div>
                            </div>
                            <Table
                                pagination={{
                                    showSizeChanger: true,
                                    defaultPageSize:
                                        financialStore.payments.filters
                                            .page_size,
                                    current:
                                        financialStore.payments.pagination
                                            .currentPage,
                                    total:
                                        financialStore.payments.pagination
                                            .totalPages *
                                        financialStore.payments.filters
                                            .page_size,
                                    onChange: onChangePagination,
                                }}
                                loading={financialStore.payments.loading}
                                columns={[
                                    {
                                        title: "Status",
                                        dataIndex: "status",
                                        key: "status",
                                        render: (value) =>
                                            value === 0
                                                ? "Em aberto"
                                                : "Baixado",
                                    },
                                    {
                                        title: "Tipo",
                                        dataIndex: "type",
                                        key: "type",
                                        render: (text) =>
                                            text === 0 ? "Credito" : "Debito",
                                    },
                                    {
                                        title: "Data",
                                        dataIndex: "date",
                                        key: "dataIndex",
                                        render: (value) => formatterDate(value),
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
                                        render: (value) => formatMoney(value),
                                    },
                                    {
                                        title: "Parcelas",
                                        dataIndex: "installments",
                                        key: "installments",
                                    },
                                    {
                                        title: "Dia de pagamento",
                                        dataIndex: "payment_date",
                                        key: "payment_date",
                                        render: (value) => formatterDate(value),
                                    },
                                    {
                                        title: "Fixo",
                                        dataIndex: "fixed",
                                        key: "fixed",
                                        render: (value) =>
                                            value ? "Sim" : "Não",
                                    },
                                    {
                                        title: 'Ações',
                                        dataIndex: 'id',
                                        key: 'id',
                                        render: value => <Link href={ `/admin/financial/payments/details/${value}` }>Detalhes</Link>
                                    }
                                ] }
                                dataSource={ financialStore.payments.data }
                            />
                        </Card>
                    </Layout>
                </Content>
            </Layout>
        </Layout>
    );
}

InvoiceDetails.auth = {
    role: "admin",
    loading: <LoadingPage />,
    unauthorized: "/signin",
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getSession({ req });

    const isSuperuser = session?.user.isSuperuser ?? false;

    if (!isSuperuser) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
    return { props: {} };
};
