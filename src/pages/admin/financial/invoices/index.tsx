import { SearchOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Layout, Table, Tag, Typography } from 'antd'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import LoadingPage from '../../../../components/loadingPage/Index'
import LoginHeader from '../../../../components/loginHeader/Index'
import MenuAdmin from '../../../../components/menuAdmin/Index'
import { fetchAllInvoice } from '../../../../store/features/financial/Index'
import { RootState, useAppDispatch } from '../../../../store/store'
import { formatMoney, formatterDate } from '../../../../util'
import styles from './Invoices.module.scss'


const { Header, Content } = Layout

const { Title } = Typography

function FinancialPage() {

    const financialStore = useSelector((state: RootState) => state.financial.invoices)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchAllInvoice())
    }, [])


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
            title: 'Valor',
            dataIndex: 'value',
            key: 'value',
            render: value => formatMoney(value)
        },
        {
            title: 'Baixado',
            dataIndex: 'value_closed',
            key: 'value_closed',
            render: value => formatMoney(value)
        },
        {
            title: 'Em aberto',
            dataIndex: 'value_open',
            key: 'value_open',
            render: value => formatMoney(value)
        },
        {
            title: 'Parcelas',
            dataIndex: 'installments',
            key: 'installments'
        },
        {
            title: 'Dia',
            dataIndex: 'date',
            key: 'date',
            render: value => formatterDate(value)
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
            render: (_, { tags }) => (
                <>
                    { tags.map(tag =>
                        <Tag key={ tag }>
                            { tag.name }
                        </Tag>
                    ) }
                </>
            ),
        },
        {
            title: 'Ações',
            dataIndex: 'id',
            key: 'id',
            render: value => <Link href={ `/admin/financial/invoices/details/${value}` }>Detalhes</Link>
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
                                <Button icon={ <SearchOutlined /> } >
                                    Filtrar
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
                                invoiceData => <TableSummary invoiceData={ invoiceData } />
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
    let totalOpen = 0
    let totalClosed = 0
    props.invoiceData.forEach((invoice) => {
        total = total + parseFloat(invoice.value)
        totalOpen = totalOpen + parseFloat(invoice.value_open)
        totalClosed = totalClosed + parseFloat(invoice.value_closed)
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