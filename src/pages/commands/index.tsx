import { useCallback } from 'react'
import Particles from 'react-tsparticles'
import { loadFull } from 'tsparticles'
import { Engine, ISourceOptions } from 'tsparticles-engine'

import particlesOptions from '../../../public/particles.json'
import MenuHeader from '../../components/menuHeader'
import styles from './Commands.module.scss'

const Commands = () => {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadFull(engine)
    }, [])

    return (
        <div className={styles['container']}>
            <div className={styles['body']}>
                <MenuHeader />
            </div>
            <Particles options={particlesOptions as ISourceOptions} init={particlesInit} />
        </div>
    )
}

export default Commands
