import { Button } from 'antd'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { downloadFacetextureService, previewFacetextureService } from '../../../services/facetextureService'
import { db } from '../../../util/db'
import Styles from './Preview.module.css'

const Preview = () => {

    const { data } = useSession()
    const [previewBackground, setPreviewBackground] = useState()

    const updatePreviewBackground = async () => {
        const background = await db.background.where('id').equals(1).first()
        previewFacetextureService(data.accessToken, {
            'background': background
        }).then(response => {
            setPreviewBackground(response)
        })
    }

    const downloadFacetexture = async () => {
        const background = await db.background.where('id').equals(1).first()
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
    )
}

export default Preview