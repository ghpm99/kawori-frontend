
import { Breadcrumb, Layout, message } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Background from '../../../components/facetexture/background';
import Characters from '../../../components/facetexture/characters';
import Loading from '../../../components/facetexture/loading';
import Preview from '../../../components/facetexture/preview';
import LoginHeader from '../../../components/loginHeader/Index';
import MenuAdmin from '../../../components/menuAdmin/Index';
import { updateFacetextureService } from '../../../services/facetexture';
import {
    fetchFacetexture,
    setFacetextureIsEdited,
    updateBackgroundReducer
} from '../../../store/features/facetexture';
import { RootState, useAppDispatch } from '../../../store/store';
import { db } from '../../../util/db';
import Styles from './Facetexture.module.scss';

const { Header, Content } = Layout;

function FaceTexture() {

    const messageRef = 'facetexture-message-ref'

    const router = useRouter()

    const dispatch = useAppDispatch()
    const facetextureStore = useSelector((state: RootState) => state.facetexture)

    useEffect(() => {

        updateBackground()
        dispatch(fetchFacetexture())

    }, [])

    useEffect(() => {
        if (facetextureStore.error) {
            router.replace('/error')
        }
    }, [facetextureStore.error])

    useEffect(() => {
        if (facetextureStore.edited && !facetextureStore.error) {
            dispatch(setFacetextureIsEdited(false))
            updateFacetextureService({
                characters: facetextureStore.facetexture.map(item => ({
                    ...item,
                    class: item.class.id
                }))
            }).then(response => {
                message.success({
                    content: response.msg,
                    key: messageRef,
                })
            }).catch(err => {
                console.log(err)
            })

        }
    }, [facetextureStore.edited])

    const updateBackground = async () => {
        const background = (await db.background.toArray())[0]

        let backgroundImage

        if (background) {
            backgroundImage = URL.createObjectURL(background.image)
        } else {
            backgroundImage = '/media/default-background.png'
            const blob = await fetch(backgroundImage).then(r => r.blob())
            await db.background.add({
                image: blob
            })
        }
        dispatch(updateBackgroundReducer(backgroundImage))

    }


    useEffect(() => {
        if (facetextureStore.loading) {
            message.loading({
                content: 'Carregando',
                key: 'loading-msg'
            })
        } else {
            message.success({
                content: 'Carregado!',
                key: 'loading-msg'
            })
        }
    }, [facetextureStore.loading])

    if (facetextureStore.loading) {
        return <Loading />
    }

    return (
        <Layout className={ Styles['container'] }>
            <MenuAdmin selected={ ['facetexture'] } />
            <Layout>
                <Header className={ Styles['header'] } >
                    <LoginHeader />
                </Header>
                <Content>
                    <Breadcrumb className={ Styles['breadcrumb'] }>
                        <Breadcrumb.Item>Kawori</Breadcrumb.Item>
                        <Breadcrumb.Item>Facetexture</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className={ Styles['container-toolkit'] }>
                        <Characters />
                        <Background />
                        <Preview />
                    </div>
                </Content>
            </Layout>
        </Layout>

    )
}

FaceTexture.auth = {
    role: 'user',
    loading: <Loading />,
    unauthorized: "/signin",
}

export default FaceTexture

