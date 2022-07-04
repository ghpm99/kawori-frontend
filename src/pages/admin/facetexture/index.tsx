
import { InboxOutlined, PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Checkbox, Image, Layout, message, Select, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { RcFile } from 'antd/lib/upload';
import Dragger from 'antd/lib/upload/Dragger';
import { useLiveQuery } from 'dexie-react-hooks';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import LoadingPage from '../../../components/loadingPage/Index';
import LoginHeader from '../../../components/loginHeader/Index';
import MenuAdmin from '../../../components/menuAdmin/Index';
import {
    downloadFacetextureService,
    fetchFaceTextureClassService,
    fetchFacetextureService,
    previewFacetextureService,
    updateFacetextureService
} from '../../../services/facetextureService';
import { db, Facetexture } from '../../../util/db';
import Styles from './Facetexture.module.css';

const { Header, Content } = Layout;

function FaceTexture() {

    const messageRef = 'facetexture-message-ref'

    const { data } = useSession()

    const [classBdo, setClassBdo] = useState([])
    const [selected, setSelected] = useState<Facetexture>()
    const [loading, setLoading] = useState(true)
    const [background, setBackground] = useState<RcFile>()
    const [previewBackground, setPreviewBackground] = useState()

    const facetexture = useLiveQuery(
        () => db.facetexture.orderBy('order').toArray()
    )

    useEffect(() => {
        setLoading(true)
        fetchFaceTextureClassService().then(response => {

            setClassBdo(response.class)
            fetchFacetextureService().then(response => {
                (response.characters as Facetexture[]).forEach(
                    facetexture => updateFacetextureLocal(facetexture)
                )
            }).finally(() => {
                setLoading(false)
            })
        })

        updateBackground()

    }, [])

    const updateBackground = async () => {
        const background = await db.background.where('id').equals(1).first()
        let backgroundImage

        if (background) {
            backgroundImage = background.image
        } else {
            backgroundImage = await fetch(`/facetexture/background-default.jpg`).then(r => r.blob())
            await db.background.add({
                image: backgroundImage
            })
        }

        setBackground(backgroundImage)
    }

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

        const classObject = (await fetchFaceTextureClassService({id: facetexture.class})).class[0]
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
        const lastFacetexture = await db.facetexture.orderBy('order').last()
        const lastOrder = lastFacetexture ? lastFacetexture.order + 1 : 0

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

        const facetextures = await db.facetexture.orderBy('order').toArray()
        const newFacetextureList = facetextures.filter(item => item.id !== facetexture.id)
        newFacetextureList.splice(newOrder, 0, facetexture)

        newFacetextureList.forEach(async (item, index) => {
            await db.facetexture.update(item.id, {
                order: index
            })
        })

        updateFacetexture()
    }

    const onDragEnd = async (result, provider) => {

        if (!result.destination) {
            return
        }
        const indexSource = result.source.index + (parseInt(result.source.droppableId) * 7)
        const indexDestination = result.destination.index + (parseInt(result.destination.droppableId) * 7)
        const facetextureSource = await db.facetexture.where('order').equals(indexSource).first()
        const facetextureDestination = await db.facetexture.where('order').equals(indexDestination).first()

        reorderCharacter(facetextureSource, facetextureDestination.order)
    }

    if (loading) {
        return <LoadingPage />
    }

    function listToMatrix(list, elementsPerSubArray) {
        var matrix = [], i, k

        for (i = 0, k = -1; i < list.length; i++) {
            if (i % elementsPerSubArray === 0) {
                k++;
                matrix[k] = []
            }

            matrix[k].push(list[i])
        }

        return matrix
    }

    const facetextureMatrix = listToMatrix(facetexture, 7)

    const uploadNewBackground = (file: RcFile) => {
        db.background.update(1, {
            image: file
        })
        setBackground(file)
    }

    const updatePreviewBackground = () => {
        previewFacetextureService(data.accessToken, {
            'background': background
        }).then(response => {
            setPreviewBackground(response)
        })
    }

    const downloadFacetexture = () => {
        downloadFacetextureService(data.accessToken, {
            'background': background
        }).then(response => {
            console.log(response)
            const downloadUrl = URL.createObjectURL(response)
            let a = document.createElement("a")
            a.href = downloadUrl
            a.download = 'export'
            document.body.appendChild(a)
            a.click()
        })
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
                    <div className={ Styles['container-toolkit'] }>
                        <div className={ Styles['characters'] }>
                            <div>
                                <h1>Personagens</h1>
                                <DragDropContext onDragEnd={ onDragEnd }>
                                    { facetextureMatrix.map((row, indexRow) => (
                                        <Droppable
                                            key={ indexRow }
                                            droppableId={ `${indexRow}` }
                                            direction='horizontal'
                                        >
                                            { (provided, snapshot) => (
                                                <div
                                                    ref={ provided.innerRef }
                                                    className={ Styles['characters-container'] }
                                                    { ...provided.droppableProps }
                                                >
                                                    { row.map((character, index) => (
                                                        <Draggable
                                                            key={ character.id.toString() }
                                                            draggableId={ character.id.toString() }
                                                            index={ index }

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
                                    )) }
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
                        <div className={ Styles['background-container'] }>
                            <h1>Background</h1>
                            <div>
                                <img
                                    src={ URL.createObjectURL(background) }
                                    alt={ 'background' }
                                />
                                <ImgCrop
                                    rotate
                                    cropperProps={ {
                                        cropSize: {
                                            width: 875,
                                            height: 640
                                        }
                                    } }
                                    aspect={ 4 / 3 }
                                >
                                    <Dragger
                                        fileList={ [] }
                                        beforeUpload={ uploadNewBackground }
                                        maxCount={ 1 }
                                    >
                                        <div>
                                            <p className="ant-upload-drag-icon">
                                                <InboxOutlined />
                                            </p>
                                            <p className="ant-upload-text">Clique ou arraste o arquivo para esta área para fazer upload</p>
                                            <p className="ant-upload-hint">
                                                Suporte para upload único
                                            </p>
                                        </div>
                                    </Dragger>
                                </ImgCrop>
                            </div>
                        </div>
                        <div className={ Styles['preview-container'] }>
                            <h1>Preview</h1>
                            <div>
                                <Button onClick={ updatePreviewBackground }>
                                    Atualizar
                                </Button>
                                <Button onClick={ downloadFacetexture }>
                                    Baixar
                                </Button>
                            </div>
                            <div>
                                { previewBackground &&
                                    <img
                                        src={ URL.createObjectURL(previewBackground) }
                                        alt={ 'preview-background' }
                                    />
                                }
                            </div>
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