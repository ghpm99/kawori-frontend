
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Layout, Table, Typography } from 'antd';
import moment from 'moment';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import LoadingPage from '../../../../components/loadingPage/Index';
import LoginHeader from '../../../../components/loginHeader/Index';
import MenuAdmin from '../../../../components/menuAdmin/Index';
import ModalFilter from '../../../../components/payments/modalFilter';
import ModalNew from '../../../../components/payments/modalNew';
import { changeVisibleModal, fetchAllPayment, saveNewPayment } from '../../../../store/features/financial/Index';
import { RootState, useAppDispatch } from '../../../../store/store';
import styles from './Payments.module.css';

const { Header, Content } = Layout;

const { Title } = Typography;

function FinancialPage() {

    const financialStore = useSelector((state: RootState) => state.financial.payments)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchAllPayment({
            active: true,
            status: 0
        }))
    }, [])

    const openModal = (modal) => {
        dispatch(changeVisibleModal({ modal: modal, visible: true }))
    }

    const closeModal = (modal) => {
        dispatch(changeVisibleModal({ modal: modal, visible: false }))
    }

    const onFinish = (values) => {
        const newPayment = {
            'type': values.type,
            'name': values.name,
            'date': moment(values.date).format('YYYY-MM-DD'),
            'installments': values.installments,
            'payment_date': moment(values.payment_date).format('YYYY-MM-DD'),
            'fixed': values.fixed ? true : false,
            'value': values.value
        }
        dispatch(saveNewPayment({ payment: newPayment }))
        closeModal('newPayment')
        dispatch(fetchAllPayment({
            active: true,
            status: 0
        }))
    }

    const setFilters = (values) => {

        let date__gte
        let date__lte
        let payment_date__gte
        let payment_date__lte

        if (values.date) {
            date__gte = values.date[0]?.toISOString().slice(0, 10)
            date__lte = values.date[1]?.toISOString().slice(0, 10)
        }
        if (values.payment_date) {
            payment_date__gte = values.payment_date[0]?.toISOString().slice(0, 10)
            payment_date__lte = values.payment_date[1]?.toISOString().slice(0, 10)
        }

        const filters: financialFilter = {
            status: values.status,
            type: values.type,
            name__icontains: values.name,
            date__gte: date__gte,
            date__lte: date__lte,
            installments: values.installments,
            payment_date__gte: payment_date__gte,
            payment_date__lte: payment_date__lte,
            fixed: values.fixed,
            active: values.active
        }
        dispatch(fetchAllPayment(filters))
        closeModal('modalFilters')
    }

    const headerTableFinancial = [
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: value => value === 0 ? 'Em aberto' : 'Baixado'
        },
        {
            title: 'Tipo',
            dataIndex: 'type',
            key: 'type',
            render: text => text === 0 ? 'Credito' : 'Debito'
        },
        {
            title: 'Data',
            dataIndex: 'date',
            key: 'dataIndex'
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
            title: 'Dia de pagamento',
            dataIndex: 'payment_date',
            key: 'payment_date'
        },
        {
            title: 'Fixo',
            dataIndex: 'fixed',
            key: 'fixed',
            render: value => value ? 'Sim' : 'Não'
        },
        {
            title: 'Ações',
            dataIndex: 'id',
            key: 'id',
            render: value => <Link href={ `/admin/financial/payments/details/${value}` }>Detalhes</Link>
        }
    ]

    return (
        <Layout className={ styles.container }>
            <MenuAdmin selected={ ['payments'] } />
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
                                <Button icon={ <SearchOutlined /> } onClick={ () => openModal('modalFilters') }>
                                    Filtrar
                                </Button>
                            </div>

                        </div>
                        <Table
                            pagination={ {
                                showSizeChanger: true
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

                        <ModalFilter
                            visible={ financialStore.modal.modalFilters.visible }
                            onCancel={ () => closeModal('modalFilters') }
                            setFilters={ setFilters }
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
    return {}
}

export default FinancialPage