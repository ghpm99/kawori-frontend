import { PlusOutlined } from '@ant-design/icons'
import { Button, Checkbox, Image, Select, Upload } from 'antd'
import { RcFile } from 'antd/lib/upload'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../../../../store/store'
import { db } from '../../../../util/db'
import Styles from './Info.module.css'

const Info = () => {
    const facetextureStore = useSelector((state: RootState) => state.facetexture)
    const dispatch = useAppDispatch()

    const updateCharacterClass = async (id, value) => {

        const facetexture = await db.facetexture.where('id').equals(id).first()
        const classObject = facetextureStore.class.find(
            item => item.id === value
        )
    }

    const updateImageSelectedCharacter = (id, file: RcFile) => {
        db.facetexture.update(id, {
            name: file.name,
            image: file,
        })
    }

    const deleteCharacter = (id) => {
        db.facetexture.delete(id)
    }

    const updateCharacterShowClass = (id, event) => {

        db.facetexture.update(id, {
            show: event.target.checked
        })
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
                            value={ selectedFacetexture?.class }
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