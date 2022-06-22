
import { Breadcrumb, Layout } from 'antd';
import { useEffect, useState } from 'react';
import LoadingPage from '../../../components/loadingPage/Index';
import LoginHeader from '../../../components/loginHeader/Index';
import MenuAdmin from '../../../components/menuAdmin/Index';
import { fetchFacetextureService } from '../../../services/facetextureService';
import Styles from './Facetexture.module.css';


const { Header, Content } = Layout;

function FaceTexture() {

    const [characters, setCharacters] = useState([])

    useEffect(() => {
        fetchFacetextureService().then(response => {
            setCharacters(response.characters)
        })
    },[])

    console.log(characters)

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
                            {characters.map(character => (
                                <div>
                                    {character.name}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h1>Background</h1>
                        <div>

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