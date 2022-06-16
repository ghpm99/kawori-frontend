import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import styles from './AccountMenuInfo.module.css'
import Link from 'next/link'

const AccountMenuInfo = (props: IAccountMenuInfoProps) => {

    return (
        <div className={ styles['dropdown'] }>
            <span>
                <FontAwesomeIcon
                icon={ faUser }
                style={{
                    marginRight: '6px',
                }}
                />
                { props.user.name }
            </span>
            <div className={styles['dropdown-content']}>
                <Link href={'/admin/user'}>
                    <p>Conta</p>
                </Link>
                <p>Sair</p>
            </div>
        </div>
    )
}

export default AccountMenuInfo;