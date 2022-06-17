
import MenuHeader from '../../components/menuHeader';
import styles from './Commands.module.css';


const Commands = (props) => {
  return (
    <div className={ styles['container'] }>
      <div className={ styles['body'] }>
        <MenuHeader />
      </div>
    </div>
  )
}

export default Commands;