
import { Button, Card, Form, Input, Layout, message } from 'antd';
import Router from 'next/router';
import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { Engine, ISourceOptions } from 'tsparticles-engine';
import particlesOptions from '../../../public/particles.json';
import MenuHeader from '../../components/menuHeader';
import { registerService } from '../../services/registerService';

const { Content } = Layout;

export default function RegisterPage(props) {

    const particlesInit = useCallback(async (engine: Engine) => {
        await loadFull(engine);
    }, []);

    const [form] = Form.useForm()

    const onFinish = (values: any) => {
        registerService(values).then(response => {
            if (response.status === 200) {
                message.success(response.data.msg)
            } else {
                message.error(response.data.msg)
            }
            form.resetFields()
            Router.push('/signin')
        }).catch(error => {
            message.error(error.response.data.msg ?? 'Falhou em criar usuário')
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
                        <Card title='Cadastrar'>
                            <Form
                                form={form}
                                name="register-form"
                                labelCol={ { span: 8 } }
                                wrapperCol={ { span: 16 } }
                                initialValues={ { remember: true } }
                                onFinish={ onFinish }
                                onFinishFailed={ onFinishFailed }
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="Usuario"
                                    name="username"
                                    rules={ [
                                        { required: true, message: 'Por favor insira seu usuário!' },
                                        { type: 'string', max: 150 }
                                    ] }
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="E-mail"
                                    name="email"
                                    rules={ [
                                        { required: true, message: 'Por favor insira seu e-mail!' },
                                        { type: 'email', message: 'Por favor verifique seu e-mail' }
                                    ] }
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Senha"
                                    name="password"
                                    rules={ [
                                        { required: true, message: 'Por favor insira sua senha!' },
                                        { type: 'string', min: 8, },
                                    ] }
                                    hasFeedback
                                >
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item
                                    label="Confirme senha"
                                    name="confirm"
                                    dependencies={ ['password'] }
                                    hasFeedback
                                    rules={ [
                                        {
                                            required: true,
                                            message: 'Por favor confirme sua senha!',
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('As duas senhas que você digitou não correspondem!'));
                                            },
                                        })
                                    ] }
                                >
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item
                                    label="Nome"
                                    name="name"
                                    rules={ [{ required: true, message: 'Por favor insira sua senha!' }] }
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Sobrenome"
                                    name="last_name"
                                    rules={ [{ required: true, message: 'Por favor insira sua senha!' }] }
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item wrapperCol={ { offset: 8, span: 16 } }>
                                    <Button type="primary" htmlType="submit">
                                        Cadastrar
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                </Layout>
            </Content >
            <Particles options={ particlesOptions as ISourceOptions } init={ particlesInit } />
        </Layout >

    )
}
