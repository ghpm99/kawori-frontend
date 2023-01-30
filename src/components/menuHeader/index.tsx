import Link from 'next/link'

import AccountMenuInfo from '../accountMenuInfo'
import styles from './MenuHeader.module.scss'
import useMenuHeader from './useMenuHeader'


export default function MenuHeader() {

    const context = useMenuHeader();

    return (
        <div className={ styles['menu-header'] }>
            <div className={ styles['menu'] }>
                <Link href='/'>
                    <a className={ styles['menu-item'] }>
                        Início
                    </a>
                </Link>
                <Link href='/facetexture'>
                    <a className={ styles['menu-item'] }>
                        FaceTexture editor
                    </a>
                </Link>
                <a
                    target='_blank'
                    href='https://discord.gg/fykNkXyn2r'
                    className={ styles['menu-item'] }
                >
                    Comunidade
                </a>
            </div>
            <div className={ styles['user-container'] }>
                <div>
                </div>
                { context.status === 'authenticated'
                    ? <div className={ styles['user-options'] }>
                        <AccountMenuInfo user={ {
                            avatar: context.data?.user?.image,
                            name: context.data?.user?.name ?? '',
                            email: context.data?.user?.email ?? ''
                        } } />
                    </div>
                    : <div className={ styles['user-options'] }>
                        <Link href='/signin'>
                            <a className={ styles['user-option'] }>
                                Logar
                            </a>
                        </Link>
                        <Link href='/register'>
                            <a className={ styles['user-option'] }>
                                Cadastrar
                            </a>
                        </Link>
                    </div>
                }
            </div>
        </div>
    )
}