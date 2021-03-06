import { PlusOutlined } from '@ant-design/icons'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Checkbox, Image, Select, Tooltip, Typography, Upload } from 'antd'
import { RcFile } from 'antd/lib/upload'
import { useSelector } from 'react-redux'
import {
    deleteCharacterReducer,
    updateCharacterClassReducer,
    updateCharacterImageNameReducer,
    updateCharacterShowClassReducer,
    updateFacetextureUrlReducer
} from '../../../../store/features/facetexture'
import { RootState, useAppDispatch } from '../../../../store/store'
import { db } from '../../../../util/db'
import Styles from './Info.module.css'

const { Title } = Typography

const Info = () => {
    const facetextureStore = useSelector((state: RootState) => state.facetexture)
    const dispatch = useAppDispatch()

    const updateCharacterClass = (id, value) => {
        dispatch(updateCharacterClassReducer({
            id: id,
            class: value
        }))
    }

    const updateImageSelectedCharacter = (id, file: RcFile) => {
        db.facetexture.update(id, {
            name: file.name,
            image: file,
            upload: true,
        })
        dispatch(updateFacetextureUrlReducer({
            id: id,
            image: URL.createObjectURL(file),
            upload: true,
        }))
        dispatch(updateCharacterImageNameReducer({
            id: id,
            name: file.name
        }))
    }

    const deleteCharacter = (id) => {
        dispatch(deleteCharacterReducer(id))
    }

    const updateCharacterShowClass = (id, event) => {
        dispatch(updateCharacterShowClassReducer({
            id: id,
            show: event.target.checked
        }))
    }

    const selectedFacetexture = facetextureStore.facetexture.find(item => item.id === facetextureStore.selected)

    return (
        <div className={ Styles['character-info'] }>
            { selectedFacetexture &&
                <>
                    <div className={Styles['controllers-info']}>
                        <Title level={ 4 }>Propriedades</Title>
                        <Title level={ 5 }>
                            Imagem atual do personagem
                            <Tooltip title='Essa ?? a imagem atual do seu personagem.
                                Caso ja tenha feito upload da imagem que fica em Meus Documentos/Black Desert/Facetexture
                                e essa imagem voltou para a padrao, n??o se preocupe, esse ?? um erro conhecido e ser?? ajustado em breve.
                            '>
                                <FontAwesomeIcon icon={ faCircleInfo } />
                            </Tooltip>
                            :
                        </Title>
                        <Image
                            src={ selectedFacetexture.image }
                            alt={ selectedFacetexture.name }
                            width={ 125 }
                            height={ 160 }
                        />
                    </div>
                    <div className={Styles['controllers-info']}>
                        <Title level={ 5 }>
                            Classe do personagem
                            <Tooltip title='Selecione a classe que voce quer que apare??a no resultado final.'>
                                <FontAwesomeIcon icon={ faCircleInfo } />
                            </Tooltip>
                            :
                        </Title>
                        <Select
                            options={ facetextureStore.class.map(
                                item => ({
                                    value: item.id,
                                    label: item.name
                                })
                            ) }
                            value={ {
                                value: selectedFacetexture?.class.id,
                                label: selectedFacetexture?.class.name
                            } }
                            style={ {
                                width: '125px'
                            } }
                            onChange={ (value) => updateCharacterClass(selectedFacetexture.id, value) }
                        />
                    </div>
                    <div className={Styles['controllers-info']}>
                        <Checkbox
                            checked={ selectedFacetexture?.show }
                            onChange={ (e) => updateCharacterShowClass(selectedFacetexture.id, e) }
                        >
                            Mostrar icone da classe
                        </Checkbox>
                    </div>
                    <div className={Styles['controllers-info']}>
                        <Title level={ 5 }>
                            Facetexture do jogo
                            <Tooltip title='Selecione a facetexture atual do personagem,
                                esse arquivo geralmente fica dentro da pasta Meus Documentos/Black Desert/Facetexture.
                                Essa ?? a imagem que aparece atualmente na sua tela de sele????o de personagem.'>
                                <FontAwesomeIcon icon={ faCircleInfo } />
                            </Tooltip>
                            :
                        </Title>

                        <Upload
                            listType='picture-card'
                            beforeUpload={ (file) => updateImageSelectedCharacter(selectedFacetexture.id, file) }
                            fileList={ [] }
                        >
                            <div>
                                <PlusOutlined />
                                <div style={ { marginTop: 8 } }>Upload</div>
                            </div>
                        </Upload>
                    </div>
                    <div className={Styles['controllers-info']}>
                        <Button
                            type='primary'
                            onClick={ () => deleteCharacter(selectedFacetexture.id) }
                        >
                            Deletar personagem
                        </Button>
                    </div>
                </>
            }
        </div>
    )
}

export default Info