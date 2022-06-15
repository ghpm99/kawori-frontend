
import { Button, Card, Checkbox, Form, Input, Layout, Typography } from 'antd';
import { signIn } from 'next-auth/react';
import MenuHeader from '../../components/menuHeader';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function LoginPage(props) {

    const onFinish = (values: any) => {
        signIn('credentials', { username: values.username, password: values.password, callbackUrl: '/' })
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Layout style={ {
            minHeight: '100vh',
            backgroundColor: 'rgb(0, 0, 27)',
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
                    backgroundColor: 'rgb(0, 0, 27)',
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

        </Layout>

    )
}
