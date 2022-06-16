import {
    Breadcrumb,
    Button,
    Card,
    Checkbox,
    DatePicker,
    InputNumber,
    Layout,
    Select,
    Typography
} from 'antd'
import { Content, Header } from 'antd/lib/layout/layout'
import moment from 'moment'
import LoadingPage from '../../../../../components/loadingPage/Index'
import LoginHeader from '../../../../../components/loginHeader/Index'
import MenuAdmin from '../../../../../components/menuAdmin/Index'
import styles from './Details.module.css'
import usePaymentDetails from './usePaymentDetails'

const { Paragraph } = Typography
const { Option } = Select

export default function PaymentDetails() {

    const context = usePaymentDetails()

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
                        <Card loading={ context.financialStore.loading }>
                            <div className={ styles.label_detail }>
                                <div className={ styles.label }>
                                    ID: { context.financialStore.data?.id }
                                </div>
                            </div>
                            <div className={ styles.label_detail }>
                                <div className={ styles.label }>
                                    Nome:
                                </div>
                                <Paragraph
                                    style={ { margin: '0' } }
                                    editable={ { onChange: context.changeName } }
                                >
                                    { context.financialStore.data?.name }
                                </Paragraph>
                            </div>
                            <div className={ styles.label_detail }>
                                <div className={ styles.label }>
                                    Dia de lançamento:
                                </div>
                                <div>
                                    { context.date }
                                </div>
                            </div>
                            <div className={ styles.label_detail }>
                                <div className={ styles.label }>
                                    Status:
                                </div>
                                <div>
                                    { context.financialStore.data?.status === 0 ? 'Em aberto' : 'Baixado' }
                                </div>
                            </div>
                            <div className={ styles.label_detail }>
                                <div className={ styles.label }>
                                    Dia de pagamento:
                                </div>
                                <DatePicker
                                    value={ moment(context.financialStore.data?.payment_date) }
                                    format='DD/MM/YYYY'
                                    onChange={ context.changePaymentDate }
                                />
                            </div>
                            <div className={ styles.label_detail }>
                                <div className={ styles.label }>
                                    Tipo:
                                </div>
                                <Select
                                    placeholder='Selecione o tipo de entrada'
                                    value={ context.financialStore.data?.type }
                                    onChange={ context.changeType }
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
                                    { context.financialStore.data?.installments }
                                </div>
                            </div>
                            <div className={ styles.label_detail }>
                                <div>
                                    <Checkbox
                                        checked={ context.financialStore.data?.fixed }
                                        onChange={ context.changeFixed }
                                    >
                                        Fixo
                                    </Checkbox>
                                </div>
                            </div>
                            <div className={ styles.label_detail }>
                                <div>
                                    <Checkbox
                                        checked={ context.financialStore.data?.active }
                                        onChange={ context.changeActive }
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
                                    value={ context.financialStore.data?.value }
                                    onChange={ context.changeValue }
                                />
                            </div>
                            <div className={ styles.buttons }>
                                {
                                    context.financialStore.data?.status === 0 ? (
                                        <Button
                                            danger
                                            type='default'
                                            onClick={ context.payoff }
                                        >
                                            Baixar pagamento
                                        </Button>
                                    ) : (<></>)
                                }
                                <Button
                                    type='primary'
                                    onClick={ context.save }
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