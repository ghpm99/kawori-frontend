import { Button, Card, Checkbox, Form, Input, Layout } from "antd";
import { signIn } from "next-auth/react";
import Router from "next/router";
import { useState } from "react";

import MenuHeader from "../../components/menuHeader";
import styles from "./Signin.module.scss";

const { Content } = Layout;

export default function LoginPage() {
    const [error, setError] = useState(false);

    const onFinish = (values: any) => {
        signIn("credentials", {
            username: values.username,
            password: values.password,
            redirect: false,
        })
            .then((e) => {
                if (e?.status !== 200) {
                    setError(true);
                } else {
                    Router.push("/admin/user");
                }
            })
            .catch((err) => {
                console.error("error", err);
                setError(true);
            });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.error("Failed:", errorInfo);
    };

    return (
        <Form
            name="basic"
            style={{ maxWidth: 600 }}
            labelCol={{ span: 4 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            {error && <div className={styles["error"]}>Usuario ou senha incorretos</div>}

            <Form.Item
                label="Usuario"
                name="username"
                rules={[
                    {
                        required: true,
                        message: "Por favor insira seu usuario!",
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Senha"
                name="password"
                rules={[
                    {
                        required: true,
                        message: "Por favor insira sua senha!",
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Lembrar-se de mim</Checkbox>
                </Form.Item>
                <a
                    href=""
                    style={{
                        float: "right",
                    }}
                >
                    Esqueci minha senha
                </a>
            </Form.Item>

            <Button
                style={{
                    float: "right",
                    width: "100%",
                }}
                type="primary"
                htmlType="submit"
            >
                Logar
            </Button>
        </Form>
    );
}
