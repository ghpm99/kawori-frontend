import { DownloadOutlined } from '@ant-design/icons'
<<<<<<< HEAD
import { Button } from 'antd'
=======
import { Button, message } from 'antd'
>>>>>>> dev
import { saveAs } from 'file-saver'
import { useState } from 'react'

import { downloadFacetextureService, previewFacetextureService } from '../../../services/facetexture'
import { db } from '../../../util/db'
import Styles from './Preview.module.scss'
<<<<<<< HEAD

const Preview = () => {
=======
import { FACETEXTURE_MESSAGE_REF } from 'pages/admin/facetexture'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'

const Preview = () => {
    const facetextureStore = useSelector((state: RootState) => state.facetexture)
>>>>>>> dev
    const [previewBackground, setPreviewBackground] = useState()
    const [loading, setLoading] = useState(false)
    const [downloading, setDownloading] = useState(false)

    const updatePreviewBackground = async () => {
        if (loading) {
            return
        }
<<<<<<< HEAD
=======
        message.loading({
            content: 'Atualizando preview',
            key: FACETEXTURE_MESSAGE_REF,
        })
>>>>>>> dev
        setLoading(true)
        const background = (await db.background.toArray())[0]
        previewFacetextureService({
            background: background.image,
        })
            .then((response) => {
<<<<<<< HEAD
                setPreviewBackground(response)
            })
=======
                message.success({
                    content: 'Preview atualizado com sucesso!',
                    key: FACETEXTURE_MESSAGE_REF,
                })
                setPreviewBackground(response)
            })
            .catch((reason) => {
                message.error({
                    content: 'Falhou em atualizar preview!',
                    key: FACETEXTURE_MESSAGE_REF,
                })
                console.log(reason)
            })
>>>>>>> dev
            .finally(() => {
                setLoading(false)
            })
    }

    const downloadFacetexture = async () => {
        if (downloading) {
            return
        }
<<<<<<< HEAD
=======
        message.loading({
            content: 'Baixando facetextures',
            key: FACETEXTURE_MESSAGE_REF,
        })
>>>>>>> dev
        setDownloading(true)
        const background = (await db.background.toArray())[0]
        downloadFacetextureService({
            background: background.image,
        })
            .then((response) => {
                saveAs(response, 'export.zip')
            })
<<<<<<< HEAD
=======
            .catch((reason) => {
                message.error({
                    content: 'Falhou em baixar!',
                    key: FACETEXTURE_MESSAGE_REF,
                })
                console.log(reason)
            })
>>>>>>> dev
            .finally(() => {
                setDownloading(false)
            })
    }

<<<<<<< HEAD
=======
    const disableButtons = facetextureStore.facetexture.length <= 0

>>>>>>> dev
    return (
        <div className={Styles['preview-container']}>
            <h1>Preview</h1>
            <div>
                <Button
<<<<<<< HEAD
=======
                    disabled={disableButtons}
>>>>>>> dev
                    onClick={updatePreviewBackground}
                    loading={loading}
                    type='primary'
                    className={Styles['update-button']}
                >
                    Atualizar
                </Button>
                <Button
<<<<<<< HEAD
=======
                    disabled={disableButtons}
>>>>>>> dev
                    onClick={downloadFacetexture}
                    loading={downloading}
                    type='primary'
                    icon={<DownloadOutlined />}
                    className={Styles['download-button']}
                >
                    Baixar
                </Button>
            </div>
            <div>
                {previewBackground && <img src={URL.createObjectURL(previewBackground)} alt={'preview-background'} />}
            </div>
        </div>
    )
}

export default Preview
