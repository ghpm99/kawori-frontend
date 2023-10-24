import {
    Breadcrumb,
    Card,
    Dropdown,
    Layout,
    Menu,
    MenuProps,
    message,
    Modal,
    Select,
    Table,
    Tag,
    Typography,
} from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MouseEventHandler, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import ModalNewInvoice, { IFormNewInvoice } from "@/components/contracts/modalNewInvoice";
import LoadingPage from "@/components/loadingPage/Index";
import LoginHeader from "@/components/loginHeader/Index";
import MenuAdmin from "@/components/menuAdmin/Index";
import { includeNewInvoiceService, mergeContractService } from "@/services/financial";
import { fetchAllContract } from "@/store/features/financial/contract";
import { RootState, useAppDispatch } from "@/store/store";
import { formatMoney, formatterDate } from "@/util/index";
import styles from "./Details.module.scss";
import {
    changeValueMergeModal,
    changeVisibleModalContract,
    fetchContractDetails,
    fetchContractInvoicesDetails,
} from "@/store/features/financial/contract/detail";
import { fetchTags } from "@/store/features/financial/tag";

const { Paragraph } = Typography;
const { Option } = Select;

export default function ContractDetails() {
    const msgRef = "contract-details-msg";

    const router = useRouter();
    const { id } = router.query;

    const financialStore = useSelector((state: RootState) => state.financial.contractDetail);
    const tagStore = useSelector((state: RootState) => state.financial.tag);
    const dispatch = useAppDispatch();

    const [searchText, setSearchText] = useState("");

    const mergeContractOption = financialStore.contracts
        .filter((item) => item.id !== financialStore.data?.id)
        .map((item) => ({
            value: item.id,
            label: `Id: ${item.id} Name: ${item.name}`,
        }));

    useEffect(() => {
        if (id) {
            const idContract = parseInt(id as string);
            dispatch(fetchContractDetails(idContract));
            dispatch(
                fetchContractInvoicesDetails({
                    id: idContract,
                    filters: {
                        page: 1,
                        page_size: 20,
                    },
                }),
            );
        }
    }, [id]);

    useEffect(() => {
        dispatch(
            fetchAllContract({
                page: 1,
                page_size: 100,
            }),
        );
        dispatch(fetchTags());
    }, []);

    const save: MouseEventHandler<HTMLButtonElement> = (event) => {
        console.log(event);
    };

    const changeName = (event: string) => {
        console.log(event);
    };

    const includeNewInvoice = (values: IFormNewInvoice) => {
        includeNewInvoiceService({
            idContract: financialStore.data.id,
            status: 0,
            type: values.type,
            name: values.name,
            date: dayjs(values.date).format("YYYY-MM-DD"),
            installments: values.installments,
            payment_date: dayjs(values.payment_date).format("YYYY-MM-DD"),
            fixed: values.fixed ? true : false,
            active: true,
            value: values.value,
            tags: values.tags,
        }).then((e) => {
            dispatch(fetchContractDetails(financialStore.data.id));
            closeModal("newInvoice");
        });
    };

    const onMenuClick: MenuProps["onClick"] = (e) => {
        switch (e.key) {
            case "1":
                dispatch(
                    changeVisibleModalContract({
                        modal: "newInvoice",
                        visible: true,
                    }),
                );
                break;
            case "2":
                dispatch(
                    changeVisibleModalContract({
                        modal: "mergeContract",
                        visible: true,
                    }),
                );
                break;
        }
    };

    const handleMergeSelectEvent = (value: any) => {
        dispatch(changeValueMergeModal(value));
    };

    const onSearch = (value: string) => {
        setSearchText(value);
    };

    const closeModal = (modal: keyof IModalContract) => {
        dispatch(
            changeVisibleModalContract({
                modal: modal,
                visible: false,
            }),
        );
    };

    const mergeContractEvent = () => {
        console.log(financialStore.modal.mergeContract.id);
        mergeContractService({
            id: financialStore.data.id,
            contracts: financialStore.modal.mergeContract.id,
        }).then((e) => {
            closeModal("mergeContract");
            message.success(e.msg);
            dispatch(fetchContractDetails(financialStore.data.id));
        });
    };

    const onChangePagination = (page: number, pageSize: number) => {
        dispatch(
            fetchContractInvoicesDetails({
                id: financialStore.data.id,
                filters: {
                    ...financialStore.invoices.filters,
                    page: page,
                    page_size: pageSize,
                },
            }),
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
                {
                    key: "2",
                    label: "Mesclar contrato",
                },
            ]}
        />
    );

    return (
        <Layout className={styles.container}>
            <MenuAdmin selected={["sub2", "contracts"]} />
            <Layout>
                <Header className={styles.header}>
                    <LoginHeader />
                </Header>
                <Content>
                    <Breadcrumb className={styles.breadcrumb}>
                        <Breadcrumb.Item>Kawori</Breadcrumb.Item>
                        <Breadcrumb.Item>Financeiro</Breadcrumb.Item>
                        <Breadcrumb.Item>Contrato</Breadcrumb.Item>
                        <Breadcrumb.Item>Detalhes</Breadcrumb.Item>
                    </Breadcrumb>
                    <Layout className={styles.container_labels}>
                        <Card loading={financialStore.loading}>
                            <div className={styles["row"]}>
                                <div className={styles["label-detail"]}>
                                    <div className={styles.label}>ID: {financialStore.data?.id}</div>
                                </div>
                                <div className={styles["label-detail"]}>
                                    <div className={styles.label}>Nome:</div>
                                    <Paragraph style={{ margin: "0" }} editable={{ onChange: changeName }}>
                                        {financialStore.data?.name}
                                    </Paragraph>
                                </div>
                                <div className={`${styles["label-detail"]} ${styles["action-Button"]}`}>
                                    <Dropdown.Button
                                        overlay={menu}
                                        type="primary"
                                        onClick={save}
                                        className={styles.button_save}
                                    >
                                        Salvar
                                    </Dropdown.Button>
                                </div>
                            </div>
                            <div className={styles["row"]}>
                                <div className={styles["label-detail"]}>
                                    <div className={styles.label}>
                                        <>Valor Total: {formatMoney(financialStore.data?.value)}</>
                                    </div>
                                </div>
                                <div className={styles["label-detail"]}>
                                    <div className={styles.label}>
                                        <>Valor Baixado: {formatMoney(financialStore.data?.value_closed)}</>
                                    </div>
                                </div>
                                <div className={styles["label-detail"]}>
                                    <div className={styles.label}>
                                        <>Valor em Aberto: {formatMoney(financialStore.data?.value_open)}</>
                                    </div>
                                </div>
                            </div>
                            <div className={styles["row"]}>
                                <div className={styles["label-detail"]}>
                                    <div className={styles.label}>Notas:</div>
                                </div>
                            </div>
                            <Table
                                pagination={{
                                    showSizeChanger: true,
                                    defaultPageSize: financialStore.invoices.filters.page_size,
                                    current: financialStore.invoices.pagination.currentPage,
                                    total:
                                        financialStore.invoices.pagination.totalPages *
                                        financialStore.invoices.filters.page_size,
                                    onChange: onChangePagination,
                                }}
                                loading={financialStore.invoices.loading}
                                columns={[
                                    {
                                        title: "Id",
                                        dataIndex: "id",
                                        key: "id",
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
                                        title: "Baixado",
                                        dataIndex: "value_closed",
                                        key: "value_closed",
                                        render: (value) => formatMoney(value),
                                    },
                                    {
                                        title: "Em aberto",
                                        dataIndex: "value_open",
                                        key: "value_open",
                                        render: (value) => formatMoney(value),
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
                                        render: (value) => formatterDate(value),
                                    },
                                    {
                                        title: "Tags",
                                        dataIndex: "tags",
                                        key: "tags",
                                        render: (_, { tags }) => (
                                            <>
                                                {tags.map((tag: any) => (
                                                    <Tag color={tag.color} key={`contract-tags-${tag.id}`}>
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
                                        render: (value) => (
                                            <Link href={`/admin/financial/invoices/details/${value}`}>Detalhes</Link>
                                        ),
                                    },
                                ]}
                                dataSource={financialStore.invoices.data}
                            />
                        </Card>
                    </Layout>
                </Content>
            </Layout>
            <Modal
                title="Mesclar contrato"
                open={financialStore.modal.mergeContract.visible}
                onCancel={() => closeModal("mergeContract")}
                onOk={mergeContractEvent}
            >
                <div>Contrato:</div>
                <Select
                    showSearch
                    placeholder="Selecione um contrato:"
                    mode="multiple"
                    onChange={handleMergeSelectEvent}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                        (option!.label as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                    }
                    options={mergeContractOption}
                    style={{
                        width: "100%",
                    }}
                />
            </Modal>
            <ModalNewInvoice
                visible={financialStore.modal.newInvoice.visible}
                onCancel={() => closeModal("newInvoice")}
                onFinish={includeNewInvoice}
                tags={tagStore.data}
            />
        </Layout>
    );
}

ContractDetails.auth = {
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
