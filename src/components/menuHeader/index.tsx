import Link from 'next/link';
import AccountMenuInfo from '../accountMenuInfo';
import styles from './MenuHeader.module.css';
import useMenuHeader from './useMenuHeader';

export default function MenuHeader(props) {

    const context = useMenuHeader();
    console.log(context.data)

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
                <Link href='/'>
                    <a className={ styles['menu-item'] }>
                        Comunidade
                    </a>
                </Link>
                <Link href='/'>
                    <a className={ styles['menu-item'] }>
                        Incorporar Bot!
                    </a>
                </Link>
            </div>
            <div className={ styles['user-container'] }>
                <div>
                </div>
                { context.status === 'authenticated'
                    ? <div className={ styles['user-options'] }>
                       <AccountMenuInfo user={{
                            avatar: '',
                            name: context.data.user.name ?? '' ,
                            email: context.data.user.email ?? ''
                       }}/>
                    </div>
                    : <div className={ styles['user-options'] }>
                        <Link href='/signin'>
                            <a className={ styles['user-option'] }>
                                Logar
                            </a>
                        </Link>
                        <Link href='/signup'>
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