import { Avatar, Breadcrumb, Layout, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import LoginHeader from '../../../components/loginHeader/Index';
import MenuAdmin from '../../../components/menuAdmin/Index';
import styles from './User.module.scss';
import { useSession } from 'next-auth/react';
import LoadingPage from '../../../components/loadingPage/Index';


const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const User = () => {

    const { data } = useSession()

    const session = data ? data as ISession: null

    const getBorderColor = () => {
        if (!session) {
            return '#fff'
        }
        if(session.user.isSuperuser){
            return 'blue'
        }
        if(session.user.isStaff){
            return 'violet'
        }
        if(session.user.isActive){
            return 'green'
        }else{
            return 'red'
        }
    }

    const formatDate = (date: string) => {

        const dateFormat = new Date(date)
        return dateFormat.toLocaleString()

    }

    return (
        <Layout className={ styles['container'] }>
            <MenuAdmin selected={ ['user'] } />
            <Layout>
                <Header className={ styles.header } >
                    <LoginHeader />
                </Header>
                <Content>
                    <Breadcrumb className={ styles.breadcrumb }>
                        <Breadcrumb.Item href='/'>Kawori</Breadcrumb.Item>
                        <Breadcrumb.Item>Usuário</Breadcrumb.Item>
                    </Breadcrumb>
                    <Layout>
                        <div className={styles['user-detail-container']}>
                            <Avatar
                                shape="circle"
                                size="large"
                                icon={ <UserOutlined /> }
                                src={ session?.user?.image }
                                style={{
                                    border: `1px solid ${getBorderColor()}`,
                                    marginBottom: '10px',
                                }}
                            />
                            <Title level={ 3 }>Nome</Title>
                            <Paragraph>{ session?.user?.name ?? "" }</Paragraph>
                            <Title level={ 3 }>Primeiro nome</Title>
                            <Paragraph
                                editable={{
                                    tooltip: 'Editar nome'
                                }}
                            >{ session?.user?.firstName ?? "" }</Paragraph>
                            <Title level={ 3 }>Ultimo nome</Title>
                            <Paragraph
                                editable={{
                                    tooltip: 'Editar nome'
                                }}
                            >{ session?.user?.lastName ?? "" }</Paragraph>
                            <Title level={ 3 }>Username</Title>
                            <Paragraph
                                editable={{
                                    tooltip: 'Editar nome'
                                }}
                            >{ session?.user?.username ?? "" }</Paragraph>
                            <Title level={ 3 }>E-mail</Title>
                            <Paragraph>{ session?.user?.email ?? "" }</Paragraph>
                            <Title level={ 3 }>Ultimo login</Title>
                            <Paragraph
                                editable={{
                                    tooltip: 'Editar nome'
                                }}
                            >
                                { session?.user?.lastLogin ? formatDate(session.user.lastLogin) : "" }
                                </Paragraph>
                            <Title level={ 3 }>Data cadastrada</Title>
                            <Paragraph
                                editable={{
                                    tooltip: 'Editar nome'
                                }}
                            >{ session?.user?.dateJoined ? formatDate(session.user.dateJoined) : "" }</Paragraph>
                        </div>
                    </Layout>
                </Content>
            </Layout>
        </Layout>
    )
}

User.auth = {
	role: 'admin',
	loading: <LoadingPage />,
	unauthorized: "/signin",
}

export default User