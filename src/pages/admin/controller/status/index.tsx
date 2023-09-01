import { Breadcrumb, Layout, Progress, Typography } from 'antd'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Pusher from 'react-pusher'
import { useDispatch, useSelector } from 'react-redux'

import LoadingPage from '../../../../components/loadingPage/Index'
import LoginHeader from '../../../../components/loginHeader/Index'
import MenuAdmin from '../../../../components/menuAdmin/Index'
import { setCpuAndMemoryValue } from '../../../../store/features/status/Index'
import { RootState } from '../../../../store/store'
import { NextPageCustom } from '../../../../types/commonTypes'
import S from './Status.module.scss'

const { Header, Content } = Layout
const { Title } = Typography

function StatusPage(): NextPageCustom {
    const statusStore = useSelector((state: RootState) => state.status)
    const dispatch = useDispatch()

    const statusEvent = (data: any) => {
        const usedMemory = (100 - data.memory).toFixed(1)
        dispatch(
            setCpuAndMemoryValue({
                cpu: data.cpu,
                memory: usedMemory,
            }),
        )
    }

    return (
        <Layout className={S.layout}>
            <MenuAdmin selected={['controller', 'status']} />
            <Layout>
                <Header className={S.header}>
                    <LoginHeader />
                </Header>
                <Content>
                    <Breadcrumb className={S.breadcrumb}>
                        <Breadcrumb.Item>Kawori</Breadcrumb.Item>
                        <Breadcrumb.Item>Status</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className={S.container}>
                        <div className={S.indicator}>
                            <Title level={2}>Uso de CPU</Title>
                            <Progress
                                type='circle'
                                strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#ff0000',
                                }}
                                percent={statusStore.cpu}
                            />
                        </div>
                        <div className={S.indicator}>
                            <Title level={2}>Uso de Memoria</Title>
                            <Progress
                                type='circle'
                                strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#ff0000',
                                }}
                                percent={statusStore.memory}
                            />
                        </div>
                    </div>
                </Content>
            </Layout>
            <Pusher channel='private-status' event='status' onUpdate={statusEvent} />
        </Layout>
    )
}

StatusPage.auth = {
    role: 'admin',
    loading: <LoadingPage />,
    unauthorized: '/signin',
}

StatusPage.pusher = {
    name: 'status',
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getSession({ req })

    const isSuperuser = session?.user.isSuperuser ?? false

    if (!isSuperuser) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    const props = {
        pusher_key: process.env.PUSHER_KEY,
        pusher_cluster: process.env.PUSHER_CLUSTER,
    }
    return { props }
}

export default StatusPage
