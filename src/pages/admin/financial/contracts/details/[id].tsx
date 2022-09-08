import { Breadcrumb, Button, Card, Layout, message, Select, Table, Typography } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import LoadingPage from '../../../../../components/loadingPage/Index';
import LoginHeader from '../../../../../components/loginHeader/Index';
import MenuAdmin from '../../../../../components/menuAdmin/Index';
import { payoffPaymentService, savePaymentDetailService } from '../../../../../services/financial';
import {
    changeActivePaymentDetails,
    changeFixedPaymentDetails,
    changeNamePaymentDetails,
    changePaymentDatePaymentDetails,
    changeTypePaymentDetails,
    changeValuePaymentDetails,
    fetchContractDetails,
    fetchPaymentDetails,
} from '../../../../../store/features/financial/Index';
import { RootState, useAppDispatch } from '../../../../../store/store';
import styles from './Details.module.scss';

const { Paragraph } = Typography
const { Option } = Select

export default function PaymentDetails() {

    const msgRef = 'payment-details-msg'

    const router = useRouter()
    const { id } = router.query

    const financialStore = useSelector((state: RootState) => state.financial.contractDetail)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (id) {
            const idContract = parseInt(id as string)
            dispatch(fetchContractDetails(idContract))
        }
    }, [id])

    const date = new Date(financialStore.data?.date).toLocaleDateString()

    const save = (event) => {
        savePaymentDetailService(id, financialStore.data).then(response => {
            message.success({
                content: response.msg,
                key: msgRef
            })
        })
    }

    const changeName = (event) => {
        dispatch(changeNamePaymentDetails(event))
    }

    const changeType = (event) => {
        dispatch(changeTypePaymentDetails(event))
    }

    const changeFixed = (event) => {
        const { checked } = event.target
        dispatch(changeFixedPaymentDetails(checked))
    }

    const changeActive = (event) => {
        const { checked } = event.target
        dispatch(changeActivePaymentDetails(checked))
    }

    const changePaymentDate = (date) => {
        dispatch(changePaymentDatePaymentDetails(date.format('YYYY-MM-DD')))
    }

    const changeValue = (event) => {
        dispatch(changeValuePaymentDetails(event))
    }

    const payoff = (event) => {
        payoffPaymentService(financialStore.data.id).then(data => {
            message.success({
                content: data.msg,
                key: msgRef
            })
            dispatch(fetchPaymentDetails(financialStore.data.id))
        })
    }

    return (
        <Layout className={ styles.container }>
            <MenuAdmin selected={ ['sub2', 'payments'] } />
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
                            <div className={ styles.label_detail }>
                                <div className={ styles.label }>
                                    ID: { financialStore.data?.id }
                                </div>
                            </div>
                            <div className={ styles.label_detail }>
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
                            <div className={ styles.label_detail }>
                                <div className={ styles.label }>
                                    Notas:
                                </div>
                                <Table
                                    columns={[
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
                                    ]}
                                    dataSource={financialStore.data?.invoices}
                                />
                            </div>
                            <div className={ styles.buttons }>
                                {
                                    financialStore.data?.status === 0 ? (
                                        <Button
                                            danger
                                            type='default'
                                            onClick={ payoff }
                                        >
                                            Baixar pagamento
                                        </Button>
                                    ) : (<></>)
                                }
                                <Button
                                    type='primary'
                                    onClick={ save }
                                    className={ styles.button_save }
                                >
                                    Salvar
                                </Button>
                            </div>
                        </Card>
                    </Layout>
                </Content>
            </Layout>
        </Layout>
    )
}

PaymentDetails.auth = {
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