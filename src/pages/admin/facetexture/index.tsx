
import { Breadcrumb, Layout } from 'antd';
import LoadingPage from '../../../components/loadingPage/Index';
import LoginHeader from '../../../components/loginHeader/Index';
import MenuAdmin from '../../../components/menuAdmin/Index';
import Styles from './Facetexture.module.css';


const { Header, Content } = Layout;

function FaceTexture() {
    return (
        <Layout className={ Styles.container }>
            <MenuAdmin selected={ ['facetexture'] } />
            <Layout>
                <Header className={ Styles.header } >
                    <LoginHeader />
                </Header>
                <Content>
                    <Breadcrumb className={ Styles.breadcrumb }>
                        <Breadcrumb.Item>Kawori</Breadcrumb.Item>
                        <Breadcrumb.Item>Facetexture</Breadcrumb.Item>
                    </Breadcrumb>
                    <div>
                        <h1>Personagens</h1>
                        <div className={Styles['characters-container']}>

                        </div>
                    </div>
                </Content>
            </Layout>
        </Layout>

    )
}

FaceTexture.auth = {
    role: 'user',
    loading: <LoadingPage />,
    unauthorized: "/signin",
}

export default FaceTexture