import { Avatar, Breadcrumb, Layout, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import LoginHeader from '../../../components/loginHeader/Index';
import MenuAdmin from '../../../components/menuAdmin/Index';
import styles from './User.module.css';
import { useSession } from 'next-auth/react';
import LoadingPage from '../../../components/loadingPage/Index';


const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const User = () => {

    const { data } = useSession()

    return (
        <Layout className={ styles['container'] }>
            <MenuAdmin selected={ ['sub2', 'report'] } />
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
                                src={ data?.user?.image }
                            />
                            <Title level={ 3 }>Nome</Title>
                            <Paragraph
                                editable={{
                                    tooltip: 'Editar nome'
                                }}
                            >{ data?.user?.name ?? "" }</Paragraph>
                            <Title level={ 3 }>E-mail</Title>
                            <Paragraph>{ data?.user?.email ?? "" }</Paragraph>
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