
import { Breadcrumb, Button, Checkbox, DatePicker, Divider, Form, Input, InputNumber, Layout, Select, Switch, Table, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingPage from '../../../components/loadingPage/Index';
import LoginHeader from '../../../components/loginHeader/Index';
import MenuCollapsible from '../../../components/menu/Index';
import {saveNewPayment } from '../../../store/features/financial/Index';
import { RootState } from '../../../store/store';
import styles from './Report.module.css'


const { Header, Content, Footer } = Layout;

const { Title } = Typography
const { Option } = Select

function FinancialPage() {

	const statusStore = useSelector((state: RootState) => state.financial)
	const dispatch = useDispatch()

	const dateFormat = 'DD/MM/YYYY'
	const customFormat = value => `${value.format(dateFormat)}`

	const formatter = new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL'
	})



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
	}

	const headerTableFinancial = [
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
			key: 'value'
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
		}
	]

	return (
		<Layout className={ styles.container }>
			<MenuCollapsible selected={ ['sub2', 'report'] } />
			<Layout>
				<Header className={ styles.header } >
					<LoginHeader />
				</Header>
				<Content>
					<Breadcrumb className={ styles.breadcrumb }>
						<Breadcrumb.Item>RMP</Breadcrumb.Item>
						<Breadcrumb.Item>Financeiro</Breadcrumb.Item>
						<Breadcrumb.Item>Relatorio</Breadcrumb.Item>
					</Breadcrumb>
					<Layout>
						<Title level={ 4 }>Relatorio por mes:</Title>
						<DatePicker
							format='MM/DD'
							picker='month'
							defaultValue={ moment(new Date(), 'MM/DD') }
						/>
						<Table columns={ headerTableFinancial } />
					</Layout>
				</Content>
			</Layout>
		</Layout>

	)
}

FinancialPage.auth = {
	role: 'admin',
	loading: <LoadingPage />,
	unauthorized: "/login",
}

export default FinancialPage