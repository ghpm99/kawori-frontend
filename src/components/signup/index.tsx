"use client";
import { Button, Form, Input, message } from "antd";

import { useAppThunkDispatch } from "@/lib/hooks";
import { INewUser, signinThunk, signupService } from "@/services/auth";
import { isFulfilled, isRejected } from "@reduxjs/toolkit";
import * as Sentry from "@sentry/nextjs";
import { useRouter } from "next/navigation";

const SingupForm = () => {
    const [form] = Form.useForm();
    const navigate = useRouter();
    const dispatch = useAppThunkDispatch();

    const signin = (username: string, password: string) => {
        dispatch(
            signinThunk({
                username: username,
                password: password,
                remember: true,
            }),
        )
            .then((action) => {
                if (isFulfilled(action)) {
                    navigate.push("/internal/user");
                } else if (isRejected(action)) {
                    Sentry.captureMessage(`Falhou em Logar ${action.error.message}`);
                    message.error("Falhou em logar");
                }
            })
            .catch((err) => {
                Sentry.captureException(err);
                console.error("error", err);
            });
    };

    const onFinish = (values: INewUser) => {
        signupService(values)
            .then((response) => {
                message.success(response.data.msg);
                form.resetFields();
                signin(values.username, values.password);
            })
            .catch((error) => {
                Sentry.captureException(error);
                message.error(error?.response?.data?.msg ?? "Falhou em criar usuário");
            });
    };

    const onFinishFailed = (errorInfo: any) => {
        Sentry.captureException(errorInfo);
        console.error("Failed:", errorInfo);
    };

    return (
        <Form
            form={form}
            layout="horizontal"
            name="register-form"
            labelCol={{ span: 8 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item label="Nome" name="name" rules={[{ required: true, message: "Por favor insira seu nome!" }]}>
                <Input data-testid='form-name'/>
            </Form.Item>
            <Form.Item
                label="Sobrenome"
                name="last_name"
                rules={[{ required: true, message: "Por favor insira seu sobrenome!" }]}
            >
                <Input data-testid='form-last-name'/>
            </Form.Item>
            <Form.Item
                label="Usuario"
                name="username"
                rules={[
                    {
                        required: true,
                        message: "Por favor insira seu usuário!",
                    },
                    { type: "string", max: 150 },
                ]}
            >
                <Input data-testid='form-username'/>
            </Form.Item>
            <Form.Item
                label="E-mail"
                name="email"
                rules={[
                    { required: true, message: "Por favor insira seu e-mail!" },
                    {
                        type: "email",
                        message: "Por favor verifique seu e-mail",
                    },
                ]}
            >
                <Input data-testid='form-email'/>
            </Form.Item>
            <Form.Item
                label="Senha"
                name="password"
                rules={[
                    { required: true, message: "Por favor insira sua senha!" },
                    { type: "string", min: 8 },
                ]}
                hasFeedback
            >
                <Input.Password data-testid='form-password'/>
            </Form.Item>
            <Form.Item
                label="Confirme senha"
                name="confirm"
                dependencies={["password"]}
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: "Por favor confirme sua senha!",
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error("As duas senhas que você digitou não correspondem!"));
                        },
                    }),
                ]}
            >
                <Input.Password data-testid='form-confirm'/>
            </Form.Item>
            <Button
                style={{
                    float: "right",
                    width: "100%",
                }}
                type="primary"
                htmlType="submit"
            >
                Cadastrar
            </Button>
        </Form>
    );
};

export default SingupForm;
