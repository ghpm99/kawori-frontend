
import MenuHeader from '../../components/menuHeader';
import styles from './Status.module.css';


export default function Status(props) {
  return (
    <div className={ styles['container'] }>
      <div className={ styles['body'] }>
        <MenuHeader />
      </div>
    </div>
  )
}
