import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Layout, Table, Typography } from 'antd';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import LoadingPage from '../../../../components/loadingPage/Index';
import LoginHeader from '../../../../components/loginHeader/Index';
import MenuAdmin from '../../../../components/menuAdmin/Index';
import { fetchAllInvoice } from '../../../../store/features/financial/Index';
import { RootState, useAppDispatch } from '../../../../store/store';
import styles from './Invoices.module.scss';


const { Header, Content } = Layout;

const { Title } = Typography;

function FinancialPage() {

    const financialStore = useSelector((state: RootState) => state.financial.invoices)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchAllInvoice())
    }, [])


    const headerTableFinancial = [
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
            render: value => <Link href={ `/admin/financial/payments/details/${value}` }>Detalhes</Link>
        }
    ]

    return (
        <Layout className={ styles.container }>
            <MenuAdmin selected={ ['invoices'] } />
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
                                <Button icon={ <PlusOutlined /> } >
                                    Novo
                                </Button>
                                <Button icon={ <SearchOutlined /> } >
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