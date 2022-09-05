import { Carousel } from 'antd';
import Link from 'next/link';
import { useCallback } from 'react';
import MenuHeader from '../components/menuHeader';
import styles from './Home.module.scss';
import { loadFull } from 'tsparticles';
import { Engine, ISourceOptions } from 'tsparticles-engine';
import particlesOptions from '../../public/particles.json'
import Particles from 'react-tsparticles';


export default function Home(props) {

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div className={ styles['container'] }>
      <div className={ styles['body'] }>
        <MenuHeader />
        <div>
          <Carousel autoplay>
            <div className={ styles['content-carousel'] }>
              <h3>
                Se divirta com o ranking de mensagens!
              </h3>
            </div>
            <div className={ styles['content-carousel'] }>
              <Link href='/facetexture'>
                <h3 >
                  Personalize sua seleção de personagem!
                </h3>
              </Link>
            </div>
            <div className={ styles['content-carousel'] }>
              <img src="/hug.png" className={ styles['image-right'] } />
              <h3>
                Interaja com outros usuários atraves de ações!
              </h3>
              <img src="/megumin.png" className={ styles['image-left'] } />
            </div>
          </Carousel>
        </div>
        <div className={ styles['card-container'] }>
          <div className={ styles['card'] }>
            <h1>
              Olá! Meu nome é Kawori e estou aqui para te auxiliar com seu grupo no Discord.
            </h1>
            <img src={ '/kawori-index-1.png' } />
          </div>
          <div className={ styles['card'] }>
            <img src={ '/role-index-1.png' } />
            <h1>
              Possuo um sistema de Auto-Roles simples e facil de utilizar.
            </h1>
          </div>
          <div className={ styles['card'] }>
            <h1>
              Também possuo varios comandos de interação e muito mais!
            </h1>
            <img src={ '/explosion-index-1.png' } />
          </div>
        </div>
      </div>
      <Particles options={ particlesOptions as ISourceOptions } init={ particlesInit } />
    </div>
  )
}
