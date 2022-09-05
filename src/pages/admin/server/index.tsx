
import { Breadcrumb, Layout } from 'antd';
import { getSession } from 'next-auth/react';
import LoadingPage from '../../../components/loadingPage/Index';
import LoginHeader from '../../../components/loginHeader/Index';
import MenuAdmin from '../../../components/menuAdmin/Index';
import styles from './Server.module.scss';


const { Header, Content, Footer } = Layout;

function ServerPage() {
    return (
        <Layout className={ styles.container }>
            <MenuAdmin selected={ ['server'] } />
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
    return {}
}

export default ServerPage