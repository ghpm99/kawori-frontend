import Link from 'next/link';
import AccountMenuInfo from '../accountMenuInfo';
import styles from './MenuHeader.module.css';
import useMenuHeader from './useMenuHeader';

export default function MenuHeader(props) {

    const context = useMenuHeader();

    return (
        <div className={ styles['menu-header'] }>
            <div className={ styles['menu'] }>
                <Link href='/'>
                    <a className={ styles['menu-item'] }>
                        Início
                    </a>
                </Link>
                <Link href='/commands'>
                    <a className={ styles['menu-item'] }>
                        Comandos
                    </a>
                </Link>
                <Link href='/facetexture'>
                    <a className={ styles['menu-item'] }>
                        FaceTexture editor
                    </a>
                </Link>
                <Link href='/status'>
                    <a className={ styles['menu-item'] }>
                        Status
                    </a>
                </Link>
                <a
                    target='_blank'
                    href='https://discord.gg/5rwtq5V'
                    className={ styles['menu-item'] }
                >
                    Comunidade
                </a>
                <a
                    target='_blank'
                    href='https://discordapp.com/api/oauth2/authorize?client_id=622218589243572224&permissions=8&scope=bot'
                    className={ styles['menu-item'] }
                >
                    Incorporar Bot!
                </a>
            </div>
            <div className={ styles['user-container'] }>
                <div>
                </div>
                { context.status === 'authenticated'
                    ? <div className={ styles['user-options'] }>
                        <AccountMenuInfo user={ {
                            avatar: context.data.user.image,
                            name: context.data.user.name ?? '',
                            email: context.data.user.email ?? ''
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