import MenuHeader from '../components/menuHeader';
import styles from './Home.module.css';


export default function Home(props) {
  return (
    <div className={ styles['container'] }>
      <div className={ styles['side'] }></div>
      <div className={ styles['body'] }>
        <MenuHeader />
      </div>
      <div className={ styles['side'] }></div>
    </div>
  )
}
