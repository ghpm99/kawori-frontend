"use client";

import { Button, Checkbox, Form, Input, Layout } from "antd";
import Router from "next/router";
import { useState } from "react";

import styles from "./Signin.module.scss";
import { signinControlledRequest } from "@/services/auth";
import { isFulfilled } from "@reduxjs/toolkit";

export default function LoginPage() {
    const [error, setError] = useState(false);

    const onFinish = (values: any) => {
        signinControlledRequest
            .dispatchRequest({
                username: values.username,
                password: values.password,
            })
            .then((action) => {
                if (isFulfilled(action)) {
                    Router.push("/admin/user");
                } else {
                    setError(true);
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
