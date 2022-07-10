import {
    Breadcrumb,
    Button,
    Card,
    Checkbox,
    DatePicker,
    InputNumber,
    Layout,
    message,
    Select,
    Typography
} from 'antd'
import { Content, Header } from 'antd/lib/layout/layout'
import moment from 'moment'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import LoadingPage from '../../../../../components/loadingPage/Index'
import LoginHeader from '../../../../../components/loginHeader/Index'
import MenuAdmin from '../../../../../components/menuAdmin/Index'
import {
    savePaymentDetailService,
    payoffPaymentService
} from '../../../../../services/financialService'
import {
    fetchPaymentDetails,
    changeNamePaymentDetails,
    changeTypePaymentDetails,
    changeFixedPaymentDetails,
    changeActivePaymentDetails,
    changePaymentDatePaymentDetails,
    changeValuePaymentDetails
} from '../../../../../store/features/financial/Index'
import { RootState, useAppDispatch } from '../../../../../store/store'
import styles from './Details.module.css'

const { Paragraph } = Typography
const { Option } = Select

export default function PaymentDetails() {

    const msgRef = 'payment-details-msg'

    const router = useRouter()
    const { id } = router.query

    const financialStore = useSelector((state: RootState) => state.financial.paymentDetail)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (id) {
            const idPayment = parseInt(id as string)
            dispatch(fetchPaymentDetails(idPayment))
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
                        <Breadcrumb.Item>Pagamento</Breadcrumb.Item>
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
                                    Dia de lançamento:
                                </div>
                                <div>
                                    { date }
                                </div>
                            </div>
                            <div className={ styles.label_detail }>
                                <div className={ styles.label }>
                                    Status:
                                </div>
                                <div>
                                    { financialStore.data?.status === 0 ? 'Em aberto' : 'Baixado' }
                                </div>
                            </div>
                            <div className={ styles.label_detail }>
                                <div className={ styles.label }>
                                    Dia de pagamento:
                                </div>
                                <DatePicker
                                    value={ moment(financialStore.data?.payment_date) }
                                    format='DD/MM/YYYY'
                                    onChange={ changePaymentDate }
                                />
                            </div>
                            <div className={ styles.label_detail }>
                                <div className={ styles.label }>
                                    Tipo:
                                </div>
                                <Select
                                    placeholder='Selecione o tipo de entrada'
                                    value={ financialStore.data?.type }
                                    onChange={ changeType }
                                >
                                    <Option value={ 0 }>
                                        Credito
                                    </Option>
                                    <Option value={ 1 }>
                                        Debito
                                    </Option>
                                </Select>
                            </div>
                            <div className={ styles.label_detail }>
                                <div className={ styles.label }>
                                    Parcelas:
                                </div>
                                <div>
                                    { financialStore.data?.installments }
                                </div>
                            </div>
                            <div className={ styles.label_detail }>
                                <div>
                                    <Checkbox
                                        checked={ financialStore.data?.fixed }
                                        onChange={ changeFixed }
                                    >
                                        Fixo
                                    </Checkbox>
                                </div>
                            </div>
                            <div className={ styles.label_detail }>
                                <div>
                                    <Checkbox
                                        checked={ financialStore.data?.active }
                                        onChange={ changeActive }
                                    >
                                        Ativo
                                    </Checkbox>
                                </div>
                            </div>
                            <div className={ styles.label_detail }>
                                <div className={ styles.label }>
                                    Valor:
                                </div>
                                <InputNumber
                                    value={ financialStore.data?.value }
                                    onChange={ changeValue }
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

    if(!isSuperuser){
        return {
            redirect: {
              destination: '/',
              permanent: false,
            },
          }
    }
    return {}
  }