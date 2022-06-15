import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import styles from './AccountMenuInfo.module.css'

const AccountMenuInfo = (props: IAccountMenuInfoProps) => {

    return (
        <div className={ styles['button'] }>
            <FontAwesomeIcon icon={ faUser } />
            { props.user.name }
        </div>
    )
}

export default AccountMenuInfo;