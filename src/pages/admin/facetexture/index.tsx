
import { Breadcrumb, Checkbox, Image, Layout, message, Select, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import LoadingPage from '../../../components/loadingPage/Index';
import LoginHeader from '../../../components/loginHeader/Index';
import MenuAdmin from '../../../components/menuAdmin/Index';
import { fetchFaceTextureClassService, fetchFacetextureService, updateFacetextureService } from '../../../services/facetextureService';
import Styles from './Facetexture.module.css';
import { db, Facetexture } from '../../../util/db';
import { useLiveQuery } from 'dexie-react-hooks';


const { Header, Content } = Layout;


function FaceTexture() {

    const messageRef = 'facetexture-message-ref'

    const [classBdo, setClasBdo] = useState([])
    const [selected, setSelected] = useState<Facetexture>()

    const facetexture = useLiveQuery(
        () => db.facetexture.toArray()
    )

    useEffect(() => {
        fetchFacetextureService().then(response => {
            console.log(response)
        })

        fetchFaceTextureClassService().then(response => {
            setClasBdo(response.class)
        })
    }, [])

    const updateFacetexture = async () => {
        updateFacetextureService({
            characters: await db.facetexture.toArray()
        }).then(response => {
            message.success({
                content: response.msg,
                key: messageRef
            })
        }).catch(error => {
            console.log(error)
            message.error({
                content: 'Falhou em atualizar',
                key: messageRef
            })
        })
    }

    const includeNewCharacteres = async () => {

        const blob = await fetch('/facetexture/default.png').then(r => r.blob())

        const id = await db.facetexture.add({
            name: 'default.png',
            order: 0,
            show: true,
            image: blob,
        })

        updateFacetexture()
    }

    const updateCharacterClass = async (id, value) => {

        const facetexture = await db.facetexture.where('id').equals(id).first()

        const classObject = classBdo.find(
            item => item.id === value
        )
        const blob = await fetch(`/facetexture/${classObject.name}.png`).then(r => r.blob())

        const newImage = facetexture.name === 'default.png'? blob : facetexture.image

        setSelected(prev => ({
            ...prev,
            class: value,
            image: newImage,
        }))
        db.facetexture.update(id, {
            class: value,
            image: newImage,
        })
        updateFacetexture()
    }

    const updateCharacterShowClass = (id, event) => {
        setSelected(prev => ({
            ...prev,
            show: event.target.checked
        }))
        db.facetexture.update(id, {
            show: event.target.checked
        })
        updateFacetexture()
    }

    const setSelectedCharacter = async (id) => {
        const facetexture = await db.facetexture.where('id').equals(id).first()
        setSelected(facetexture)
    }

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
                    <div className={ Styles['characters'] }>
                        <div>
                            <h1>Personagens</h1>
                            <div className={ Styles['characters-container'] }>
                                { facetexture?.map((character, index) => (
                                    <div
                                        key={ `character-${index}` }
                                        className={ Styles['character'] }
                                        onClick={ (event) => setSelectedCharacter(character.id) }
                                    >
                                        {
                                            character.image &&
                                            <img
                                                src={ URL.createObjectURL(character.image) }
                                                alt={ character.name }
                                                width={ 125 }
                                                height={ 160 }
                                            />
                                        }

                                    </div>
                                )) }
                                <div
                                    className={ Styles['include-characters'] }
                                    onClick={ includeNewCharacteres }
                                >
                                    +
                                </div>
                            </div>
                        </div>
                        <div className={ Styles['character-info'] }>
                            { selected &&
                                <>
                                    <div>
                                        <div>Propriedades</div>
                                        <Image
                                            src={ URL.createObjectURL(selected.image) }
                                            alt={ selected?.name }
                                            width={ 125 }
                                            height={ 160 }
                                        />
                                    </div>
                                    <div>
                                        <Select
                                            options={ classBdo.map(
                                                item => ({
                                                    value: item.id,
                                                    label: item.name
                                                })
                                            ) }
                                            value={ selected?.class }
                                            style={ {
                                                width: '125px'
                                            } }
                                            onChange={ (value) => updateCharacterClass(selected.id, value) }
                                        />
                                    </div>
                                    <div>
                                        <Checkbox
                                            checked={ selected?.show }
                                            onChange={ (e) => updateCharacterShowClass(selected.id, e) }
                                        >
                                            Mostrar icone da classe
                                        </Checkbox>
                                    </div>
                                    <div>
                                        <Upload
                                            listType='picture-card'
                                        >
                                            <div>
                                                <PlusOutlined />
                                                <div style={ { marginTop: 8 } }>Upload</div>
                                            </div>
                                        </Upload>
                                    </div>
                                </>
                            }
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