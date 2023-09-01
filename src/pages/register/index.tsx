import { Button, Card, Form, Input, Layout, message } from 'antd'
import { signIn } from 'next-auth/react'
import Router from 'next/router'

import MenuHeader from '../../components/menuHeader'
import { signupService } from '../../services/auth'
import SingupForm from 'components/signup'

const { Content } = Layout

export default function RegisterPage() {
    return (
        <Layout
            style={{
                minHeight: '100vh',
                backgroundColor: 'rgb(0, 0, 27, 0.8)',
            }}
        >
            <MenuHeader />
            <Content>
                <Layout
                    style={{
                        width: '100vw',
                        height: '90vh',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgb(0, 0, 27, 0)',
                    }}
                >
                    <div style={{ maxWidth: '50%' }}>
                        <Card title='Cadastrar'>
                            <SingupForm />
                        </Card>
                    </div>
                </Layout>
            </Content>
        </Layout>
    )
}
