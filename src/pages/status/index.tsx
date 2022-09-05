
import Particles from 'react-tsparticles';
import MenuHeader from '../../components/menuHeader';
import styles from './Status.module.scss';
import { loadFull } from 'tsparticles';
import { Engine, ISourceOptions } from 'tsparticles-engine';
import particlesOptions from '../../../public/particles.json';
import { useCallback } from 'react';


export default function Status(props) {

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div className={ styles['container'] }>
      <div className={ styles['body'] }>
        <MenuHeader />
      </div>
      <Particles options={ particlesOptions as ISourceOptions } init={ particlesInit } />
    </div>
  )
}
