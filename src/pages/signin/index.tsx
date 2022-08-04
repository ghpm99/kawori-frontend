
import { Button, Card, Checkbox, Form, Input, Layout } from 'antd';
import { signIn } from 'next-auth/react';
import  Router from 'next/router';
import { useCallback, useState } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { Engine, ISourceOptions } from 'tsparticles-engine';
import particlesOptions from '../../../public/particles.json';
import MenuHeader from '../../components/menuHeader';
import styles from './Signin.module.css';

const { Content } = Layout;

export default function LoginPage(props) {

    const [error, setError] = useState(false)

    const particlesInit = useCallback(async (engine: Engine) => {
        await loadFull(engine);
    }, []);

    const onFinish = (values: any) => {
        signIn(
            'credentials',
            {
                username: values.username,
                password: values.password,
                redirect: false
            }).then(e => {
                console.log(e)
                if (e.status !== 200) {
                    setError(true)
                } else {
                   Router.push('/admin/user')
                }
            }).catch(err => {
                console.log('error', err)
                setError(true)
            })
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Layout style={ {
            minHeight: '100vh',
            backgroundColor: 'rgb(0, 0, 27, 0.8)',
        } }>
            <MenuHeader />
            <Content>
                <Layout style={ {
                    width: '100vw',
                    height: '90vh',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgb(0, 0, 27, 0)',
                } }>
                    <div style={ { maxWidth: '50%' } }>
                        <Card title='Login'>
                            <Form
                                name="basic"
                                labelCol={ { span: 8 } }
                                wrapperCol={ { span: 16 } }
                                initialValues={ { remember: true } }
                                onFinish={ onFinish }
                                onFinishFailed={ onFinishFailed }
                                autoComplete="off"
                            >
                                {
                                    error &&
                                    <div className={ styles['error'] }>
                                        Usuario ou senha incorretos
                                    </div>
                                }


                                <Form.Item
                                    label="Usuario"
                                    name="username"
                                    rules={ [{ required: true, message: 'Por favor insira seu usuario!' }] }
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Senha"
                                    name="password"
                                    rules={ [{ required: true, message: 'Por favor insira sua senha!' }] }
                                >
                                    <Input.Password />
                                </Form.Item>

                                <Form.Item name="remember" valuePropName="checked" wrapperCol={ { offset: 8, span: 16 } }>
                                    <Checkbox>Lembrar-se de mim</Checkbox>
                                </Form.Item>

                                <Form.Item wrapperCol={ { offset: 8, span: 16 } }>
                                    <Button type="primary" htmlType="submit">
                                        Logar
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                </Layout>
            </Content>
            <Particles options={ particlesOptions as ISourceOptions } init={ particlesInit } />
        </Layout>

    )
}
