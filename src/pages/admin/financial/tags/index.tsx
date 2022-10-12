import { PlusOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Layout, message, Table, Tag, Typography } from 'antd'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import LoadingPage from '../../../../components/loadingPage/Index'
import LoginHeader from '../../../../components/loginHeader/Index'
import MenuAdmin from '../../../../components/menuAdmin/Index'
import ModalNewTag, { IFormModalNewTag } from '../../../../components/tags/modalNew'
import { includeNewTagService } from '../../../../services/financial'
import { changeVisibleModalTag, fetchTags } from '../../../../store/features/financial/Index'
import { RootState, useAppDispatch } from '../../../../store/store'
import styles from './tags.module.scss'


const { Header, Content } = Layout

const { Title } = Typography

function TagPage() {

    const financialStore = useSelector((state: RootState) => state.financial.tags)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchTags())
    }, [])

    const openModal = (modal: keyof IModalTags) => {
        dispatch(changeVisibleModalTag({ modal, visible: true }))
    }

    const closeModal = (modal: keyof IModalTags) => {
        dispatch(changeVisibleModalTag({  modal, visible: false }))
    }

    const onFinish = (values: IFormModalNewTag) => {
        const newTag = {
            'name': values.name,
            'color': values.color
        }

        includeNewTagService(newTag).then(e => {
            console.log(e)
            message.success(e.msg)
            closeModal('newTag')
            dispatch(fetchTags())
        })
    }

    const headerTableFinancial = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            render: (_: any, tag: ITags) => (
                <Tag
                    color={tag.color}
                >
                    { tag.name }
                </Tag>
            ),
        }
    ]

    return (
        <Layout className={ styles.container }>
            <MenuAdmin selected={ ['tags'] } />
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
                                <Button icon={ <PlusOutlined /> } onClick={ () => openModal('newTag') }>
                                    Novo
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
                        />
                        <ModalNewTag
                            visible={ financialStore.modal.newTag.visible }
                            onCancel={ () => closeModal('newTag') }
                            onFinish={ onFinish }
                        />
                    </Layout>
                </Content>
            </Layout>
        </Layout>

    )
}

TagPage.auth = {
    role: 'admin',
    loading: <LoadingPage />,
    unauthorized: "/signin",
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
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

export default TagPage