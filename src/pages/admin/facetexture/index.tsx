
import { Breadcrumb, Checkbox, Image, Layout, message, Select } from 'antd';
import { useEffect, useState } from 'react';
import LoadingPage from '../../../components/loadingPage/Index';
import LoginHeader from '../../../components/loginHeader/Index';
import MenuAdmin from '../../../components/menuAdmin/Index';
import { fetchFaceTextureClassService, fetchFacetextureService, updateFacetextureService } from '../../../services/facetextureService';
import Styles from './Facetexture.module.css';


const { Header, Content } = Layout;

interface ICharacter {
    image: string
    name: string
    class: string
    show: boolean
}

function FaceTexture() {

    const messageRef = 'facetexture-message-ref'

    const [characters, setCharacters] = useState<ICharacter[]>([])
    const [classBdo, setClasBdo] = useState([])
    const [selectedCharacter, setSelectedCharacter] = useState<number>()

    useEffect(() => {
        fetchFacetextureService().then(response => {
            setCharacters(response.characters)
        })

        fetchFaceTextureClassService().then(response => {
            setClasBdo(response.class)
        })
    }, [])

    const updateFacetexture = () => {
        updateFacetextureService({
            characters: characters
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

    const includeNewCharacteres = () => {
        setCharacters((prev) => [
            ...prev,
            {
                image: 'default.png',
                name: '',
                class: '',
                show: false,
            }
        ])

        updateFacetexture()
    }

    const updateCharacterClass = (index, value) => {

        const charactersTemp = [...characters]

        if (!charactersTemp[index]) {
            return
        }
        charactersTemp[index].class = value

        charactersTemp[index].image = getClassImage(value)

        setCharacters(charactersTemp)

        updateFacetexture()
    }

    const getClassImage = (value) => {
        const classObject = classBdo.find(
            item => item.id === value
        )

        return `${classObject.name}.png`
    }

    const updateCharacterShowClass = (index, event) => {

        const charactersTemp = [...characters]

        if (!charactersTemp[index]) {
            return
        }

        charactersTemp[index].show = event.target.checked

        setCharacters(charactersTemp)

        updateFacetexture()
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
                                { characters.map((character, index) => (
                                    <div
                                        key={ `character-${index}` }
                                        className={ Styles['character'] }
                                        onClick={ (event) => setSelectedCharacter(index) }
                                    >
                                        <img
                                            src={ `/facetexture/${character?.image}` }
                                            alt={ character.name }
                                            width={ 125 }
                                            height={ 160 }
                                        />
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
                            <div>
                                <div>Propriedades</div>
                                <Image
                                    src={ `/facetexture/${characters[selectedCharacter]?.image}` }
                                    alt={ characters[selectedCharacter]?.name }
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
                                    value={ characters[selectedCharacter]?.class }
                                    style={ {
                                        width: '125px'
                                    } }
                                    onChange={ (value) => updateCharacterClass(selectedCharacter, value) }
                                />
                            </div>
                            <div>
                                <Checkbox
                                    checked={characters[selectedCharacter]?.show}
                                    onChange={(e) => updateCharacterShowClass(selectedCharacter, e)}
                                >
                                    Mostrar icone da classe
                                </Checkbox>
                            </div>
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