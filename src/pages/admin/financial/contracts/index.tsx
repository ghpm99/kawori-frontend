import { PlusOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Layout, message, Table, Typography } from 'antd'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import ModalNew, { INewContractForm } from '../../../../components/contracts/modalNew'
import LoadingPage from '../../../../components/loadingPage/Index'
import LoginHeader from '../../../../components/loginHeader/Index'
import MenuAdmin from '../../../../components/menuAdmin/Index'
import { saveNewContractService } from '../../../../services/financial'
import { changeVisibleContractsModal, fetchAllContract } from '../../../../store/features/financial/Index'
import { RootState, useAppDispatch } from '../../../../store/store'
import { formatMoney } from '../../../../util'
import styles from './Contracts.module.scss'


const { Header, Content } = Layout

const { Title } = Typography

function FinancialPage() {

    const financialStore = useSelector((state: RootState) => state.financial.contracts)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchAllContract({}))
    }, [])

    const openModal = (modal: keyof IModalContracts) => {
        dispatch(changeVisibleContractsModal({ modal: modal, visible: true }))
    }

    const closeModal = (modal: keyof IModalContracts) => {
        dispatch(changeVisibleContractsModal({ modal: modal, visible: false }))
    }

    const onFinish = (values: INewContractForm) => {
        const newContract = {
            'name': values.name,
        }

        saveNewContractService(newContract).then(e => {
            console.log(e)
            message.success(e.msg)
            closeModal('newPayment')
            dispatch(fetchAllContract({}))
        })
    }

    const headerTableFinancial = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            render: (value: any) => <Link href={ `/admin/financial/contracts/details/${value}` }>{value}</Link>
        },
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Total',
            dataIndex: 'value',
            key: 'value',
            render: (value: any) => formatMoney(value)
        },
        {
            title: 'Baixado',
            dataIndex: 'value_closed',
            key: 'value_closed',
            render: (value: any) => formatMoney(value)
        },
        {
            title: 'Em aberto',
            dataIndex: 'value_open',
            key: 'value_open',
            render: (value: any) => formatMoney(value)
        },
        {
            title: 'Ações',
            dataIndex: 'id',
            key: 'id',
            render: (value: any) => <Link href={ `/admin/financial/contracts/details/${value}` }>Detalhes</Link>
        }
    ]

    return (
        <Layout className={ styles.container }>
            <MenuAdmin selected={ ['contracts'] } />
            <Layout>
                <Header className={ styles.header } >
                    <LoginHeader />
                </Header>
                <Content>
                    <Breadcrumb className={ styles.breadcrumb }>
                        <Breadcrumb.Item>Kawori</Breadcrumb.Item>
                        <Breadcrumb.Item>Financeiro</Breadcrumb.Item>
                        <Breadcrumb.Item>Em aberto</Breadcrumb.Item>
                    </Breadcrumb>
                    <Layout>
                        <div className={ styles.header_command }>
                            <Title level={ 3 } className={ styles.title }>
                                Valores em aberto
                            </Title>
                            <div>
                                <Button icon={ <PlusOutlined /> } onClick={ () => openModal('newPayment') }>
                                    Novo
                                </Button>
                            </div>

                        </div>
                        <Table
                            pagination={ {
                                showSizeChanger: true,
                                defaultPageSize: 20
                            } }
                            columns={ headerTableFinancial }
                            dataSource={ financialStore.data }
                            loading={ financialStore.loading }
                            summary={
                                contractData => <TableSummary contractData={ contractData } />
                            }
                        />
                        <ModalNew
                            visible={ financialStore.modal.newPayment.visible }
                            onCancel={ () => closeModal('newPayment') }
                            onFinish={ onFinish }
                        />
                    </Layout>
                </Content>
            </Layout>
        </Layout>

    )
}



function TableSummary({contractData}: {contractData: readonly IContractPagination[]}) {

    const { Text } = Typography

    let total = 0
    let totalOpen = 0
    let totalClosed = 0
    contractData.forEach((contract) => {
        total = total + contract.value
        totalOpen = totalOpen + contract.value_open
        totalClosed = totalClosed + contract.value_closed
    })

    return (
        <>
            <Table.Summary.Row>
                <Table.Summary.Cell index={ 0 }>
                    <Text>Total: { formatMoney(total) }</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={ 1 }>
                    <Text>Em aberto: { formatMoney(totalOpen) }</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={ 2 }>
                    <Text>Baixado: { formatMoney(totalClosed) }</Text>
                </Table.Summary.Cell>
            </Table.Summary.Row>
        </>
    )
}

FinancialPage.auth = {
    role: 'admin',
    loading: <LoadingPage />,
    unauthorized: "/signin",
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getSession({ req })

    const isSuperuser = session?.user.isSuperuser ?? false

    if (!isSuperuser) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    return {
        props: {}
    }
}

export default FinancialPage