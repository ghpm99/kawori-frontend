
import { Breadcrumb, Button, Input, Layout, Typography } from 'antd';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Pusher from 'react-pusher';
import LoadingPage from '../../components/loadingPage/Index';
import LoginHeader from '../../components/loginHeader/Index';
import MenuCollapsible from '../../components/menu/Index';
import { sendCommandService } from '../../services/remoteService';
import styles from './Command.module.css';


const { Header, Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

let pusher

function CommandPage(props) {

    const [command, setCommand] = useState('')
    const [commandReturn, setCommandReturn] = useState('')
    const { data, status } = useSession()


    const sendCommand = () => {
        sendCommandService(command)
        setCommand('')
    }

    return (
        <Layout className={ styles.container }>
            <MenuCollapsible selected={ ['2'] } />
            <Layout>
                <Header className={ styles.header } >
                    <LoginHeader />
                </Header>
                <Content>
                    <Breadcrumb className={ styles.breadcrumb }>
                        <Breadcrumb.Item>RMP</Breadcrumb.Item>
                        <Breadcrumb.Item>Comando</Breadcrumb.Item>
                    </Breadcrumb>
                    <Layout className={ styles.command_container }>
                        <Input.Group>
                            <div className={ styles.command_input }>
                                <div className={ styles.input }>
                                    <Input
                                        placeholder='Digite um comando'
                                        name='command'
                                        onChange={ (event) => { setCommand(event.target.value) } }
                                        value={ command }

                                    />
                                </div>
                                <Button
                                    type='primary'
                                    onClick={ () => { sendCommand() } }
                                >
                                    Enviar comando
                                </Button>
                            </div>
                            <div>
                                <Title level={ 4 }>Retorno do comando:</Title>
                                <TextArea
                                    contentEditable={false}
                                    rows={ 4 }
                                    value={ commandReturn }
                                />
                            </div>
                        </Input.Group>
                    </Layout>
                </Content>
            </Layout>
            <Pusher
                channel='private-display'
                event='command-return'
                onUpdate={ (data) => setCommandReturn(data.output) }
            />
        </Layout>

    )


}

CommandPage.auth = {
    role: 'admin',
    loading: <LoadingPage />,
    unauthorized: "/login",
}

CommandPage.pusher = {
    name: 'command'
}

export async function getServerSideProps() {
    const props = {
        pusher_key: process.env.PUSHER_KEY,
        pusher_cluster: process.env.PUSHER_CLUSTER
    }
    return { props }
}

export default CommandPage