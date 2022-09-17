import { PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Layout, message, Table, Typography } from 'antd';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import ModalNew from '../../../../components/contracts/modalNew';
import LoadingPage from '../../../../components/loadingPage/Index';
import LoginHeader from '../../../../components/loginHeader/Index';
import MenuAdmin from '../../../../components/menuAdmin/Index';
import { saveNewContractService } from '../../../../services/financial';
import { changeVisibleContractsModal, fetchAllContract } from '../../../../store/features/financial/Index';
import { RootState, useAppDispatch } from '../../../../store/store';
import styles from './Contracts.module.scss';


const { Header, Content } = Layout

const { Title } = Typography

function FinancialPage() {

    const financialStore = useSelector((state: RootState) => state.financial.contracts)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchAllContract())
    }, [])

    const openModal = (modal) => {
        dispatch(changeVisibleContractsModal({ modal: modal, visible: true }))
    }

    const closeModal = (modal) => {
        dispatch(changeVisibleContractsModal({ modal: modal, visible: false }))
    }

    const onFinish = (values) => {
        const newContract = {
            'name': values.name,
        }

        saveNewContractService(newContract).then(e => {
            console.log(e)
            message.success(e.msg)
            closeModal('newPayment')
            dispatch(fetchAllContract())
        })
    }

    const headerTableFinancial = [
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
            title: 'Ações',
            dataIndex: 'id',
            key: 'id',
            render: value => <Link href={ `/admin/financial/contracts/details/${value}` }>Detalhes</Link>
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
                                paymentData => <TableSummary paymentData={ paymentData } />
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

function TableSummary(props) {

    const { Text } = Typography

    let total = 0
    let totalCredit = 0
    let totalDebit = 0
    props.paymentData.forEach((payment) => {
        if (payment.type === 0) {
            total = total + parseFloat(payment.value)
            totalCredit = totalCredit + parseFloat(payment.value)
        } else {
            total = total - parseFloat(payment.value)
            totalDebit = totalDebit + parseFloat(payment.value)
        }
    })

    return (
        <>
            <Table.Summary.Row>
                <Table.Summary.Cell index={ 0 }>
                    <Text>Total: R$ { total.toFixed(2) }</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={ 1 }>
                    <Text>Total Credito: R$ { totalCredit.toFixed(2) }</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={ 2 }>
                    <Text>Total Debito: R$ { totalDebit.toFixed(2) }</Text>
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
    return {
        props: {}
    }
}

export default FinancialPage