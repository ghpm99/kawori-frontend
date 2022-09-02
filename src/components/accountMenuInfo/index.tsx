import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import styles from './AccountMenuInfo.module.scss'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

const AccountMenuInfo = (props: IAccountMenuInfoProps) => {

    return (
        <div className={ styles['dropdown'] }>
            <Link href={ '/admin/user' }>
                <span>
                    <FontAwesomeIcon
                        icon={ faUser }
                        style={ {
                            marginRight: '6px',
                        } }
                    />
                    { props.user.name }
                </span>
            </Link>
            <div className={ styles['dropdown-content'] }>
                <Link href={ '/admin/user' }>
                    <p>Conta</p>
                </Link>
                <p onClick={ () => signOut() }>Sair</p>
            </div>
        </div>
    )
}

export default AccountMenuInfo;