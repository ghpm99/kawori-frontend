
import { Breadcrumb, Layout, message } from 'antd';
import axios from 'axios';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Background from '../../../components/facetexture/background';
import Characters from '../../../components/facetexture/characters';
import Loading from '../../../components/facetexture/loading';
import Preview from '../../../components/facetexture/preview';
import LoginHeader from '../../../components/loginHeader/Index';
import MenuAdmin from '../../../components/menuAdmin/Index';
import {
    fetchFacetexture,
    fetchFacetextureClass,
    updateBackgroundReducer,
    updateFacetextureUrlReducer
} from '../../../store/features/facetexture';
import { RootState, useAppDispatch } from '../../../store/store';
import { db, Facetexture } from '../../../util/db';
import Styles from './Facetexture.module.css';

const { Header, Content } = Layout;

function FaceTexture() {

    const messageRef = 'facetexture-message-ref'

    const dispatch = useAppDispatch()
    const facetextureStore = useSelector((state: RootState) => state.facetexture)


    useEffect(() => {

        updateBackground()

        dispatch(fetchFacetextureClass())
        dispatch(fetchFacetexture()).then(action => {
            (action.payload as IFacetexture[]).map(item => {
                updateFacetextureLocal(item)
            })
        })

    }, [])

    const updateBackground = async () => {
        const background = (await db.background.toArray())[0]
        console.log(background)
        let backgroundImage

        if (background) {
            backgroundImage = URL.createObjectURL(background.image)
        } else {
            backgroundImage = '/facetexture/default-background.png'
            const blob = await fetch(backgroundImage).then(r => r.blob())
            await db.background.add({
                image: blob
            })
        }
        dispatch(updateBackgroundReducer(backgroundImage))

    }

    const updateFacetextureLocal = async (facetexture: IFacetexture) => {
        const facetextureLocal = await db.facetexture.where('id').equals(facetexture.id).first()

        if (!facetextureLocal) {
            includeNewCharacterLocal(facetexture)
        } else {
            dispatch(updateFacetextureUrlReducer({
                id: facetextureLocal.id,
                image: URL.createObjectURL(facetextureLocal.image),
                upload: facetextureLocal.upload,
            }))
            const facetextureUpdate: Facetexture = {
                ...facetexture,
                image: facetextureLocal.image,
                class: facetexture.class.id
            }
            updateCharacterLocal(facetextureUpdate)
        }
    }

    const includeNewCharacterLocal = async (facetexture: IFacetexture) => {

        const blob = await axios.get(facetexture.image).then(r => r.data.blob())

        await db.facetexture.add({
            ...facetexture,
            class: facetexture.class.id,
            image: blob,
        })
    }

    const updateCharacterLocal = (facetexture: Facetexture) => {
        db.facetexture.update(facetexture.id, {
            ...facetexture
        })
    }

    if (facetextureStore.loading) {
        return <Loading />
    }

    message.success({
        content: 'Carregado',
        key: 'loading-msg'
    })

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

