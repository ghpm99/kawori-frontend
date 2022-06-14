import { Breadcrumb, Layout } from 'antd'
import { Content, Header } from 'antd/lib/layout/layout'
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoadingPage from '../../../components/loadingPage/Index'
import LoginHeader from '../../../components/loginHeader/Index'
import MenuCollapsible from '../../../components/menu/Index'
import PaymentFixed from '../../../components/overview/paymentFixed'
import PaymentWithFixed from '../../../components/overview/paymentWithFixed'
import PaymentWithoutFixed from '../../../components/overview/paymentWithoutFixed'
import { fetchPaymentReport } from '../../../store/features/financial/Index'
import { RootState } from '../../../store/store'
import styles from './Overview.module.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)

function Overview() {
  const financialStore = useSelector((state: RootState) => state.financial.paymentReport)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPaymentReport())
  }, [])

  function OverviewReport() {
    return (
      <>
        <PaymentWithFixed data={ financialStore.data } />
        <PaymentWithoutFixed payments={ financialStore.data.open } />
        <PaymentFixed
          fixedCredit={ financialStore.data.fixed_credit }
          fixedDebit={ financialStore.data.fixed_debit }
        />
      </>
    )
  }

  return (
    <Layout className={ styles.container }>
      <MenuCollapsible selected={ ['sub2', 'overview'] } />
      <Layout>
        <Header className={ styles.header }>
          <LoginHeader />
        </Header>
        <Content>
          <Breadcrumb className={ styles.breadcrumb }>
            <Breadcrumb.Item>RMP</Breadcrumb.Item>
            <Breadcrumb.Item>Financeiro</Breadcrumb.Item>
            <Breadcrumb.Item>Overview</Breadcrumb.Item>
          </Breadcrumb>
          <Layout>
            { financialStore.loading ?
              <>
                Carregando
              </> :
              <OverviewReport />
            }

          </Layout>
        </Content>
      </Layout>
    </Layout>
  )
}


Overview.auth = {
  role: 'admin',
  loading: <LoadingPage />,
  unauthorized: '/login',
}

export default Overview
