import { Breadcrumb, Card, Dropdown, Layout, Menu, MenuProps, message, Modal, Select, Table, Typography } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import LoadingPage from '../../../../../components/loadingPage/Index';
import LoginHeader from '../../../../../components/loginHeader/Index';
import MenuAdmin from '../../../../../components/menuAdmin/Index';
import { includeNewInvoiceService, mergeContractService } from '../../../../../services/financial';
import {
    changeValueMergeModal,
    changeVisibleMergeModal,
    fetchAllContract,
    fetchContractDetails,
} from '../../../../../store/features/financial/Index';
import { RootState, useAppDispatch } from '../../../../../store/store';
import { formatMoney } from '../../../../../util';
import styles from './Details.module.scss';

const { Paragraph } = Typography
const { Option } = Select

export default function ContractDetails() {

    const msgRef = 'contract-details-msg'

    const router = useRouter()
    const { id } = router.query

    const financialStore = useSelector((state: RootState) => state.financial.contractDetail)
    const dispatch = useAppDispatch()

    const [searchText, setSearchText] = useState('')

    const mergeContractOption = financialStore.contracts.filter(item => item.id !== financialStore.data?.id).map(item => ({
        value: item.id,
        label: `Id: ${item.id} Name: ${item.name}`
    }))

    useEffect(() => {
        if (id) {
            const idContract = parseInt(id as string)
            dispatch(fetchContractDetails(idContract))
        }
    }, [id])

    useEffect(() => {
        dispatch(fetchAllContract())
    }, [])

    const save = (event) => {
        console.log(event)
    }

    const changeName = (event) => {
        console.log(event)
    }

    const includeNewInvoice = () => {
        const date = new Date().toISOString().split('T')[0]
        includeNewInvoiceService({
            id: financialStore.data.id,
            status: 0,
            type: 1,
            name: '',
            date: date,
            installments: 2,
            payment_date: date,
            fixed: false,
            active: true,
            value: 100,
        }).then(e => {
            dispatch(fetchContractDetails(financialStore.data.id))
        })
    }

    const onMenuClick: MenuProps['onClick'] = e => {
        switch (e.key) {
            case '1':
                includeNewInvoice()
                break
            case '2':
                dispatch(changeVisibleMergeModal(true))
                break
        }
    }

    const handleMergeSelectEvent = (value) => {
        dispatch(changeValueMergeModal(value))
    }

    const onSearch = (value: string) => {
        setSearchText(value)
    }

    const closeMergeModal = () => {
        dispatch(changeVisibleMergeModal(false))
    }

    const mergeContractEvent = () => {
        console.log(financialStore.modal.mergeContract.id)
        mergeContractService({
            id: financialStore.data.id,
            contracts: financialStore.modal.mergeContract.id
        }).then(e => {
            closeMergeModal()
            message.success(e.msg)
            dispatch(fetchContractDetails(financialStore.data.id))
        })
    }

    const menu = (
        <Menu
            onClick={ onMenuClick }
            items={ [
                {
                    key: '1',
                    label: 'Incluir nova nota',
                },
                {
                    key: '2',
                    label: 'Mesclar contrato',
                }
            ] }
        />
    )

    return (
        <Layout className={ styles.container }>
            <MenuAdmin selected={ ['sub2', 'contracts'] } />
            <Layout>
                <Header className={ styles.header } >
                    <LoginHeader />
                </Header>
                <Content>
                    <Breadcrumb className={ styles.breadcrumb }>
                        <Breadcrumb.Item>Kawori</Breadcrumb.Item>
                        <Breadcrumb.Item>Financeiro</Breadcrumb.Item>
                        <Breadcrumb.Item>Contrato</Breadcrumb.Item>
                        <Breadcrumb.Item>Detalhes</Breadcrumb.Item>
                    </Breadcrumb>
                    <Layout className={ styles.container_labels }>
                        <Card loading={ financialStore.loading }>
                            <div className={ styles['row'] }>
                                <div className={ styles['label-detail'] }>
                                    <div className={ styles.label }>
                                        ID: { financialStore.data?.id }
                                    </div>
                                </div>
                                <div className={ styles['label-detail'] }>
                                    <div className={ styles.label }>
                                        Nome:
                                    </div>
                                    <Paragraph
                                        style={ { margin: '0' } }
                                        editable={ { onChange: changeName } }
                                    >
                                        { financialStore.data?.name }
                                    </Paragraph>
                                </div>
                                <div className={ `${styles['label-detail']} ${styles['action-Button']}` }>
                                    <Dropdown.Button
                                        overlay={ menu }
                                        type='primary'
                                        onClick={ save }
                                        className={ styles.button_save }
                                    >
                                        Salvar
                                    </Dropdown.Button>
                                </div>
                            </div>
                            <div className={ styles['row'] }>
                                <div className={ styles['label-detail'] }>
                                    <div className={ styles.label }>
                                        Valor Total: { formatMoney(financialStore.data?.value) }
                                    </div>
                                </div>
                                <div className={ styles['label-detail'] }>
                                    <div className={ styles.label }>
                                        Valor Baixado: { formatMoney(financialStore.data?.value_closed) }
                                    </div>
                                </div>
                                <div className={ styles['label-detail'] }>
                                    <div className={ styles.label }>
                                        Valor em Aberto: { formatMoney(financialStore.data?.value_open) }
                                    </div>
                                </div>
                            </div>
                            <div className={ styles['row'] }>
                                <div className={ styles['label-detail'] }>
                                    <div className={ styles.label }>
                                        Notas:
                                    </div>
                                </div>
                            </div>
                            <Table
                                columns={ [
                                    {
                                        title: 'Status',
                                        dataIndex: 'status',
                                        key: 'status',
                                        render: value => value === 0 ? 'Em aberto' : 'Baixado'
                                    },
                                    {
                                        title: 'Id',
                                        dataIndex: 'id',
                                        key: 'id'
                                    },
                                    {
                                        title: 'Nome',
                                        dataIndex: 'name',
                                        key: 'name'
                                    },
                                    {
                                        title: 'Valor',
                                        dataIndex: 'value',
                                        key: 'value',
                                        render: text => `R$ ${text}`
                                    },
                                    {
                                        title: 'Parcelas',
                                        dataIndex: 'installments',
                                        key: 'installments'
                                    },
                                    {
                                        title: 'Dia',
                                        dataIndex: 'date',
                                        key: 'date'
                                    },
                                    {
                                        title: 'Ações',
                                        dataIndex: 'id',
                                        key: 'id',
                                        render: value => <Link href={ `/admin/financial/invoices/details/${value}` }>Detalhes</Link>
                                    }
                                ] }
                                dataSource={ financialStore.data?.invoices }
                            />
                        </Card>
                    </Layout>
                </Content>
            </Layout>
            <Modal
                title='Mesclar contrato'
                visible={ financialStore.modal.mergeContract.visible }
                onCancel={ closeMergeModal }
                onOk={ mergeContractEvent }
            >
                <div>
                    Contrato:
                </div>
                <Select
                    showSearch
                    placeholder='Selecione um contrato:'
                    mode='multiple'
                    onChange={ handleMergeSelectEvent }
                    onSearch={ onSearch }
                    filterOption={ (input, option) => (option!.label as unknown as string)?.toLowerCase().includes(input.toLowerCase()) }
                    options={ mergeContractOption }
                    style={ {
                        width: '100%'
                    } }
                />
            </Modal>
        </Layout>
    )
}

ContractDetails.auth = {
    role: 'admin',
    loading: <LoadingPage />,
    unauthorized: "/signin",
}

export const getServerSideProps = async ({ req, res }) => {
    const session = await getSession({ req })

    const isSuperuser = (session as unknown as ISession).user.isSuperuser

    if (!isSuperuser) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    return { props: {} }
}