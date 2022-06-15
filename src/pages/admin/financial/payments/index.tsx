
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Layout, Table, Typography } from 'antd';
import Link from 'next/link';
import LoadingPage from '../../../../components/loadingPage/Index';
import LoginHeader from '../../../../components/loginHeader/Index';
import MenuAdmin from '../../../../components/menuAdmin/Index';
import ModalFilter from '../../../../components/payments/modalFilter';
import ModalNew from '../../../../components/payments/modalNew';
import styles from './Payments.module.css';
import useFinancialPage from './useFinancialPage';

const { Header, Content } = Layout;

const { Title } = Typography;

function FinancialPage() {

    const context = useFinancialPage()

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
            render: value => <Link href={`/financial/payments/details/${value}`}>Detalhes</Link>
        }
    ]

    return (
        <Layout className={ styles.container }>
            <MenuAdmin selected={ ['sub2', 'payments'] } />
            <Layout>
                <Header className={ styles.header } >
                    <LoginHeader />
                </Header>
                <Content>
                    <Breadcrumb className={ styles.breadcrumb }>
                        <Breadcrumb.Item>RMP</Breadcrumb.Item>
                        <Breadcrumb.Item>Financeiro</Breadcrumb.Item>
                        <Breadcrumb.Item>Em aberto</Breadcrumb.Item>
                    </Breadcrumb>
                    <Layout>
                        <div className={ styles.header_command }>
                            <Title level={ 3 } className={ styles.title }>
                                Valores em aberto
                            </Title>
                            <div>
                                <Button icon={ <PlusOutlined /> } onClick={ () => context.openModal('newPayment') }>
                                    Novo
                                </Button>
                                <Button icon={ <SearchOutlined /> } onClick={ () => context.openModal('modalFilters') }>
                                    Filtrar
                                </Button>
                            </div>

                        </div>
                        <Table
                            pagination={ {
                                showSizeChanger: true
                            } }
                            columns={ headerTableFinancial }
                            dataSource={ context.financialStore.data }
                            loading={ context.financialStore.loading }
                            summary={
                                paymentData => <TableSummary paymentData={paymentData}/>
                            }
                        />

                        <ModalNew
                            visible={ context.financialStore.modal.newPayment.visible }
                            onCancel={ () => context.closeModal('newPayment') }
                            onFinish={ context.onFinish }
                        />

                        <ModalFilter
                            visible={ context.financialStore.modal.modalFilters.visible }
                            onCancel={ () => context.closeModal('modalFilters') }
                            setFilters={ context.setFilters }
                        />

                    </Layout>
                </Content>
            </Layout>
        </Layout>

    )
}

function TableSummary(props) {

    const {Text} = Typography

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
    unauthorized: "/login",
}

export default FinancialPage