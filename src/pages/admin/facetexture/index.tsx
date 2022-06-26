
import { Breadcrumb, Button, Checkbox, Image, Layout, message, Select, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import LoadingPage from '../../../components/loadingPage/Index';
import LoginHeader from '../../../components/loginHeader/Index';
import MenuAdmin from '../../../components/menuAdmin/Index';
import { fetchFaceTextureClassService, fetchFacetextureService, updateFacetextureService } from '../../../services/facetextureService';
import Styles from './Facetexture.module.css';
import { db, Facetexture } from '../../../util/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { RcFile } from 'antd/lib/upload';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

const { Header, Content } = Layout;


function FaceTexture() {

    const messageRef = 'facetexture-message-ref'

    const [classBdo, setClasBdo] = useState([])
    const [selected, setSelected] = useState<Facetexture>()
    const [loading, setLoading] = useState(true)

    const facetexture = useLiveQuery(
        () => db.facetexture.orderBy('order').toArray()
    )

    useEffect(() => {
        setLoading(true)
        fetchFaceTextureClassService().then(response => {

            setClasBdo(response.class)
            fetchFacetextureService().then(response => {
                (response.characters as Facetexture[]).forEach(
                    facetexture => updateFacetextureLocal(facetexture)
                )
            }).finally(() => {
                setLoading(false)
            })
        })

    }, [])

    const updateFacetextureLocal = async (facetexture: Facetexture) => {
        const facetextureLocal = await db.facetexture.where('id').equals(facetexture.id).first()

        if (!facetextureLocal) {
            includeNewCharacterLocal(facetexture)
        } else {
            facetexture.image = facetextureLocal.image
            updateCharacterLocal(facetexture)
        }
    }

    const includeNewCharacterLocal = async (facetexture: Facetexture) => {

        const classObject = classBdo.find(
            item => item.id === facetexture.class
        )
        const blob = await fetch(`/facetexture/${classObject?.name ?? 'default'}.png`).then(r => r.blob())

        await db.facetexture.add({
            ...facetexture,
            image: blob,
        })
    }

    const updateCharacterLocal = (facetexture: Facetexture) => {
        db.facetexture.update(facetexture.id, {
            ...facetexture
        })
    }

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

        const lastOrder = ((await db.facetexture.orderBy('order').last())?.order ?? 0) + 1

        const id = await db.facetexture.add({
            name: 'default.png',
            order: lastOrder,
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

        const newImage = facetexture.name === 'default.png' ? blob : facetexture.image

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

    const updateImageSelectedCharacter = (id, file: RcFile) => {
        setSelected(prev => ({
            ...prev,
            name: file.name,
            image: file,
        }))
        db.facetexture.update(id, {
            name: file.name,
            image: file,
        })
        updateFacetexture()
    }

    const deleteCharacter = (id) => {
        db.facetexture.delete(id)
        setSelected(undefined)
        updateFacetexture()
    }

    const reorderCharacter = async (facetexture: Facetexture, newOrder: number) => {
        if (newOrder <= 0) {
            return
        }
        //source = id: 15 order:4
        //destination = id:16 order:5
        // 5 > 4
        console.log('source', facetexture.order)
        console.log('destination', newOrder)
        if (newOrder > facetexture.order) {
            const facetexturesMiddle = await db.facetexture.where('order').between(facetexture.order, newOrder + 1).toArray()
            console.log('middle', facetexturesMiddle)
            for (const facetextureMiddle of facetexturesMiddle) {
                console.log(facetextureMiddle.order)
                db.facetexture.update(facetextureMiddle.id, {
                    order: facetextureMiddle.order - 1
                })
            }
        }

        const facetexturesAfter = await db.facetexture.where('order').aboveOrEqual(newOrder).toArray()
        console.log('after', facetexturesAfter)

        for (const facetextureAfter of facetexturesAfter) {
            console.log(facetextureAfter.order)
            db.facetexture.update(facetextureAfter.id, {
                order: facetextureAfter.order + 1
            })
        }
        console.log('destination', newOrder)
        db.facetexture.update(facetexture.id, {
            order: newOrder
        })

    }

    const onDragEnd = async (result, provider) => {
        console.log(result, provider)
        if (!result.destination) {
            return
        }

        const facetextureSource = await db.facetexture.where('id').equals(result.source.index).first()
        const facetextureDestination = await db.facetexture.where('id').equals(result.destination.index).first()

        reorderCharacter(facetextureSource, facetextureDestination.order)

        updateFacetexture()
    }

    if (loading) {
        return <LoadingPage />
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
                            <DragDropContext onDragEnd={ onDragEnd }>
                                <Droppable
                                    droppableId='droppable'
                                    type='CHARACTERS'
                                    direction='horizontal'
                                >
                                    { (provided, snapshot) => (
                                        <div
                                            { ...provided.droppableProps }
                                            ref={ provided.innerRef }
                                            className={ Styles['characters-container'] }
                                        >
                                            { facetexture?.map((character, index) => (
                                                <Draggable
                                                    key={ character.id.toString() }
                                                    draggableId={ character.id.toString() }
                                                    index={ character.id }

                                                >
                                                    { (provided, snapshot) => (
                                                        <div
                                                            ref={ provided.innerRef }
                                                            { ...provided.dragHandleProps }
                                                            { ...provided.draggableProps }
                                                            key={ character.id.toString() }
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
                                                    ) }

                                                </Draggable>
                                            )) }
                                            { provided.placeholder }
                                        </div>
                                    ) }
                                </Droppable>
                            </DragDropContext>
                            <div
                                className={ Styles['include-characters'] }
                                onClick={ includeNewCharacteres }
                            >
                                +
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
                                            beforeUpload={ (file) => updateImageSelectedCharacter(selected.id, file) }
                                            fileList={ [] }
                                        >
                                            <div>
                                                <PlusOutlined />
                                                <div style={ { marginTop: 8 } }>Upload</div>
                                            </div>
                                        </Upload>
                                    </div>
                                    <div>
                                        <Button
                                            type='primary'
                                            onClick={ () => deleteCharacter(selected.id) }
                                        >
                                            Deletar personagem
                                        </Button>
                                    </div>
                                    <div>
                                        <Button
                                            type='primary'
                                            onClick={ () => {
                                                reorderCharacter(selected, selected.order - 1)
                                                setSelected(prev => ({
                                                    ...prev,
                                                    order: prev.order - 1
                                                }))
                                            } }
                                        >
                                            Mover para anterior
                                        </Button>
                                        <Button
                                            type='primary'
                                            onClick={ () => {
                                                reorderCharacter(selected, selected.order + 1)
                                                setSelected(prev => ({
                                                    ...prev,
                                                    order: prev.order + 1
                                                }))
                                            } }
                                        >
                                            Mover para proximo
                                        </Button>
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