
import { Breadcrumb, Button, Input, Layout, Slider, Typography } from 'antd';
import { useEffect, useState } from 'react';
import Pusher from 'react-pusher';
import LoadingPage from '../../../../components/loadingPage/Index';
import LoginHeader from '../../../../components/loginHeader/Index';
import MenuAdmin from '../../../../components/menuAdmin/Index';
import {
    hotkeyService,
    keyPressService,
    mouseButtonService,
    mouseMoveButtonService,
    mouseMoveService,
    mouseScrollService,
    screenSizeService
} from '../../../../services/remoteService';
import styles from './Remote.module.css';


const { Header, Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;


function RemotePage(props) {

    const [hook, setHook] = useState({
        src: 'https://rmp-server-dev.herokuapp.com/media/screenshot/screenshot.png'
    })

    const [key, setKey] = useState('')
    const [hotkey, setHotkey] = useState('')
    const [screenSize, setScreenSize] = useState({
        screen_width: 0,
        screen_height: 0,
        x: 0,
        y: 0
    })

    useEffect(() => {
        screenSizeService().then(data => {
            setScreenSize(data)
        })

    }, [])

    const onNewScreenshot = (data) => {
        setHook({
            src: `${process.env.NEXT_PUBLIC_API_URL}/media/screenshot/screenshot.png?${Date.now()}`
        })
    }

    const onClickScreenshot = (event) => {

        setScreenSize({
            ...screenSize,
            x: event.nativeEvent.offsetX,
            y: event.nativeEvent.offsetY
        })

        if (event.detail === 1) {
            mouseMoveButtonService(event.nativeEvent.offsetX, event.nativeEvent.offsetY, 'click')
        } else if (event.detail === 2) {
            mouseMoveButtonService(event.nativeEvent.offsetX, event.nativeEvent.offsetY, 'double-click')
        }
    }

    const onContextScreenshot = (event) => {

        event.preventDefault()

        setScreenSize({
            ...screenSize,
            x: event.nativeEvent.offsetX,
            y: event.nativeEvent.offsetY
        })

        mouseMoveButtonService(event.nativeEvent.offsetX, event.nativeEvent.offsetY, 'click-right')
    }

    return (
        <Layout className={ styles.container }>
            <MenuAdmin selected={ ['controller', 'remote'] } />
            <Layout>
                <Header className={ styles.header } >
                    <LoginHeader />
                </Header>
                <Content>
                    <Breadcrumb className={ styles.breadcrumb }>
                        <Breadcrumb.Item>Kawori</Breadcrumb.Item>
                        <Breadcrumb.Item>Remoto</Breadcrumb.Item>
                    </Breadcrumb>
                    <Layout className={ styles.key_hold }>
                        <Input.Group compact className={ styles.command_input }>
                            <div className={ styles.input }>
                                <Input
                                    placeholder='Pressione uma tecla'
                                    name='key'
                                    onChange={ (event) => { setKey(event.target.value) } }
                                    value={ key }
                                />
                            </div>
                            <Button
                                type='primary'
                                onClick={ () => {
                                    keyPressService(key)
                                    setKey('')
                                } }
                            >
                                Enviar tecla
                            </Button>
                        </Input.Group>
                    </Layout>
                    <Layout className={ styles.hotkey }>
                        <Input.Group compact className={ styles.command_input }>
                            <div className={ styles.input }>
                                <Input
                                    placeholder='Pressione uma tecla'
                                    name='key'
                                    onChange={ (event) => { setHotkey(event.target.value) } }
                                    value={ hotkey }
                                />
                            </div>
                            <Button
                                type='primary'
                                onClick={ () => {
                                    hotkeyService(hotkey)
                                    setHotkey('')
                                } }
                            >
                                Enviar combinação de tecla
                            </Button>
                        </Input.Group>
                        <div className={ styles.mouse_container }>
                            <div className={ styles.commands }>
                                <div className={ styles.buttons }>
                                    <Button
                                        type='primary'
                                        className={ styles.buttons_mouse }
                                        onClick={ () => mouseButtonService('click') }
                                    >
                                        Clicar
                                    </Button>
                                    <Button
                                        type='primary'
                                        className={ styles.buttons_mouse }
                                        onClick={ () => mouseButtonService('double-click') }
                                    >
                                        Click duplo
                                    </Button>
                                    <Button
                                        type='primary'
                                        className={ styles.buttons_mouse }
                                        onClick={ () => mouseButtonService('click-right') }
                                    >
                                        Click direito
                                    </Button>
                                    <Button
                                        type='primary'
                                        className={ styles.buttons_mouse }
                                        onClick={ () => mouseScrollService(100) }
                                    >
                                        Scroll up
                                    </Button>
                                    <Button
                                        type='primary'
                                        className={ styles.buttons_mouse }
                                        onClick={ () => mouseScrollService(-100) }
                                    >
                                        Scroll down
                                    </Button>
                                    <Button
                                        type='primary'
                                        onClick={ () => mouseMoveService(screenSize.x, screenSize.y) }
                                        className={ styles.buttons_mouse }
                                    >
                                        Mover
                                    </Button>
                                </div>
                                <div className={ styles.screenshot_container }>
                                    <img
                                        src={ hook.src }
                                        onClick={ onClickScreenshot }
                                        onContextMenu={ onContextScreenshot }
                                    />
                                </div>
                            </div>
                            <Slider
                                min={ 0 }
                                max={ screenSize.screen_width }
                                value={ screenSize.x }
                                onChange={ (event) => setScreenSize({
                                    ...screenSize,
                                    x: event
                                }) }
                            />
                            <div className={ styles.vertical_slider }>
                                <Slider
                                    reverse
                                    vertical
                                    min={ 0 }
                                    max={ screenSize.screen_height }
                                    value={ screenSize.y }
                                    onChange={ (event) => setScreenSize({
                                        ...screenSize,
                                        y: event
                                    }) }
                                />
                            </div>
                        </div>

                    </Layout>
                </Content>
            </Layout>
            <Pusher
                channel='private-remote'
                event='new-screenshot'
                onUpdate={ onNewScreenshot }
            />
        </Layout>

    )


}

RemotePage.auth = {
    role: 'admin',
    loading: <LoadingPage />,
    unauthorized: "/signin",
}

RemotePage.pusher = {
    name: 'Remote'
}

export async function getServerSideProps() {
    const props = {
        pusher_key: process.env.PUSHER_KEY,
        pusher_cluster: process.env.PUSHER_CLUSTER
    }
    return { props }
}

export default RemotePage