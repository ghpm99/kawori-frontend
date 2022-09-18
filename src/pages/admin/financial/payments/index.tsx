import { ClearOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, DatePicker, Input, Layout, Select, Table, Typography } from 'antd';
import moment from 'moment';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import FilterDropdown from '../../../../components/common/filterDropdown/Index';
import LoadingPage from '../../../../components/loadingPage/Index';
import LoginHeader from '../../../../components/loginHeader/Index';
import MenuAdmin from '../../../../components/menuAdmin/Index';
import { cleanFilterPayments, fetchAllPayment, setFilterPayments } from '../../../../store/features/financial/Index';
import { RootState, useAppDispatch } from '../../../../store/store';
import { formatMoney, formatterDate } from '../../../../util';
import styles from './Payments.module.scss';


const { Header, Content } = Layout

const { Title } = Typography
const { RangePicker } = DatePicker

const dateFormat = 'YYYY-MM-DD'
const customFormat = ['DD/MM/YYYY', 'DD/MM/YYYY']

function FinancialPage() {

    const financialStore = useSelector((state: RootState) => state.financial.payments)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchAllPayment({
            active: true,
            status: 0
        }))
    }, [])

    const cleanFilter = () => {
        dispatch(cleanFilterPayments())
        dispatch(fetchAllPayment({
            active: true,
            status: 0
        }))
    }

    const applyFilter = (event) => {
        event.preventDefault()
        dispatch(fetchAllPayment({
            ...financialStore.filters,
            active: true,
        }))
    }

    const handleChangeFilter = (e) => {
        const { name, value } = e.target

        dispatch(setFilterPayments({ name, value }))
    }

    const handleSelectFilter = (name, value) => {
        dispatch(setFilterPayments({ name, value }))
    }

    const handleDateRangedFilter = (name: string, dates: string[]) => {
        console.log(dates)
        const dateGte = dates[0] ? moment(dates[0], 'DD/MM/YYYY').format('YYYY-MM-DD') : null
        const dateLte = dates[1] ? moment(dates[1], 'DD/MM/YYYY').format('YYYY-MM-DD') : null

        dispatch(setFilterPayments({ name: `${name}__gte`, value: dateGte }))
        dispatch(setFilterPayments({ name: `${name}__lte`, value: dateLte }))
    }

    const headerTableFinancial = [
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: value => value === 0 ? 'Em aberto' : 'Baixado',
            filterDropdown: (props) => (
                <FilterDropdown applyFilter={ applyFilter }>
                    <Select
                        style={ { width: 220 } }
                        options={ [
                            { label: 'Todos', value: '' },
                            { label: 'Em aberto', value: 0 },
                            { label: 'Baixado', value: 1 }
                        ] }
                        onChange={ (value) => handleSelectFilter('status', value) }
                        value={ financialStore.filters?.status ?? '' }
                    />
                </FilterDropdown>
            )
        },
        {
            title: 'Tipo',
            dataIndex: 'type',
            key: 'type',
            render: text => text === 0 ? 'Credito' : 'Debito',
            filterDropdown: (props) => (
                <FilterDropdown applyFilter={ applyFilter }>
                    <Select
                        style={ { width: 220 } }
                        options={ [
                            { label: 'Todos', value: '' },
                            { label: 'Credito', value: 0 },
                            { label: 'Debito', value: 1 }
                        ] }
                        onChange={ (value) => handleSelectFilter('type', value) }
                        value={ financialStore.filters?.type ?? '' }
                    />
                </FilterDropdown>
            )
        },
        {
            title: 'Data',
            dataIndex: 'date',
            key: 'dataIndex',
            render: value => formatterDate(value),
            filterDropdown: (props) => (
                <FilterDropdown applyFilter={ applyFilter }>
                    <RangePicker
                        name={ 'date' }
                        onChange={ (_, formatString) => {
                            handleDateRangedFilter('date', formatString)
                        } }
                        format={ customFormat }
                        value={ [
                            moment(financialStore.filters?.date__gte),
                            moment(financialStore.filters?.date__lte)
                        ] }
                    />
                </FilterDropdown>
            )
        },
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            filterDropdown: (props) => (
                <FilterDropdown applyFilter={ applyFilter }>
                    <Input
                        name='name__icontains'
                        style={ { width: 220 } }
                        onChange={ (event) => handleChangeFilter(event) }
                        value={ financialStore.filters?.name__icontains ?? '' }
                    />
                </FilterDropdown>
            )
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            key: 'value',
            render: value => formatMoney(value)
        },
        {
            title: 'Parcelas',
            dataIndex: 'installments',
            key: 'installments'
        },
        {
            title: 'Dia de pagamento',
            dataIndex: 'payment_date',
            key: 'payment_date',
            render: value => formatterDate(value),
            filterDropdown: (props) => (
                <FilterDropdown applyFilter={ applyFilter }>
                    <RangePicker
                        name={ 'payment_date' }
                        onChange={ (_, formatString) => {
                            handleDateRangedFilter('payment_date', formatString)
                        } }
                        format={ customFormat }
                        value={ [
                            moment(financialStore.filters?.payment_date__gte),
                            moment(financialStore.filters?.payment_date__lte)
                        ] }
                    />
                </FilterDropdown>
            )
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
                                <Button icon={ <ClearOutlined /> } onClick={ cleanFilter }>
                                    Limpar filtros
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
                    <Text>Total: { formatMoney(total) }</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={ 1 }>
                    <Text>Total Credito: { formatMoney(totalCredit) }</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={ 2 }>
                    <Text>Total Debito: { formatMoney(totalDebit) }</Text>
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