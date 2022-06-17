
import { Breadcrumb, Layout } from 'antd';
import LoadingPage from '../../../components/loadingPage/Index';
import LoginHeader from '../../../components/loginHeader/Index';
import MenuAdmin from '../../../components/menuAdmin/Index';
import MenuCollapsible from '../../../components/menuAdmin/Index';
import styles from './Server.module.css'


const { Header, Content, Footer } = Layout;

function ServerPage() {
    return (
        <Layout className={ styles.container }>
            <MenuAdmin selected={ ['7'] } />
            <Layout>
                <Header className={ styles.header } >
                    <LoginHeader />
                </Header>
                <Content>
                    <Breadcrumb className={ styles.breadcrumb }>
                        <Breadcrumb.Item>Kawori</Breadcrumb.Item>
                        <Breadcrumb.Item>Servidor</Breadcrumb.Item>
                    </Breadcrumb>
                </Content>
            </Layout>
        </Layout>

    )
}

ServerPage.auth = {
    role: 'admin',
    loading: <LoadingPage />,
    unauthorized: "/signin",
}

export default ServerPage