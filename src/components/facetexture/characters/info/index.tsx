import { PlusOutlined } from '@ant-design/icons'
import { Button, Checkbox, Image, Select, Upload } from 'antd'
import { RcFile } from 'antd/lib/upload'
import { useSelector } from 'react-redux'
import { deleteCharacterReducer, setFacetextureIsEdited, updateCharacterClassReducer, updateCharacterShowClassReducer, updateFacetextureUrlReducer } from '../../../../store/features/facetexture'
import { RootState, useAppDispatch } from '../../../../store/store'
import { db } from '../../../../util/db'
import Styles from './Info.module.css'

const Info = () => {
    const facetextureStore = useSelector((state: RootState) => state.facetexture)
    const dispatch = useAppDispatch()

    const updateCharacterClass = (id, value) => {
        dispatch(updateCharacterClassReducer({
            id:id,
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
        dispatch(setFacetextureIsEdited(true))
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
                    <div>
                        <div>Propriedades</div>
                        <Image
                            src={ selectedFacetexture.image }
                            alt={ selectedFacetexture.name }
                            width={ 125 }
                            height={ 160 }
                        />
                    </div>
                    <div>
                        <Select
                            options={ facetextureStore.class.map(
                                item => ({
                                    value: item.id,
                                    label: item.name
                                })
                            ) }
                            value={{
                                value: selectedFacetexture?.class.id,
                                label: selectedFacetexture?.class.name
                            }}
                            style={ {
                                width: '125px'
                            } }
                            onChange={ (value) => updateCharacterClass(selectedFacetexture.id, value) }
                        />
                    </div>
                    <div>
                        <Checkbox
                            checked={ selectedFacetexture?.show }
                            onChange={ (e) => updateCharacterShowClass(selectedFacetexture.id, e) }
                        >
                            Mostrar icone da classe
                        </Checkbox>
                    </div>
                    <div>
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
                    <div>
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