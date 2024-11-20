import { Button, Checkbox, Form, Input } from "antd";

import { useState } from "react";

import { isFulfilled, isRejected } from "@reduxjs/toolkit";

import { useAppThunkDispatch } from "@/lib/hooks";
import { signinThunk } from "@/services/auth";
import * as Sentry from "@sentry/nextjs";
import { useRouter } from "next/navigation";
import styles from "./Signin.module.scss";
import { userDetailsThunk } from "@/lib/features/auth";

export default function LoginPage() {
    const [error, setError] = useState(false);
    const navigate = useRouter();
    const dispatch = useAppThunkDispatch();

    const onFinish = (values: any) => {
        dispatch(
            signinThunk({
                username: values.username,
                password: values.password,
                remember: values.remember,
            }),
        )
            .then((action) => {
                if (isFulfilled(action)) {
                    dispatch(userDetailsThunk());
                } else if (isRejected(action)) {
                    Sentry.captureMessage(`Falhou em Logar ${action.error.message}`);
                    console.error("error", action);
                    setError(true);
                }
            })
            .catch((err) => {
                Sentry.captureException(err);
                console.error("error", err);
                setError(true);
            });
    };

    const onFinishFailed = (errorInfo: any) => {
        Sentry.captureException(errorInfo);
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
