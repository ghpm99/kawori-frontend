import { Button, Form, Input, message } from "antd";
import { signIn } from "next-auth/react";
import Router from "next/router";
import { signupService } from "@/services/auth";

const SingupForm = () => {
    const [form] = Form.useForm();

    const signin = (username: string, password: string) => {
        signIn("credentials", {
            username: username,
            password: password,
            redirect: false,
        })
            .then((e) => {
                if (e?.status !== 200) {
                    message.error("Falhou em logar");
                } else {
                    Router.push("/admin/user");
                }
            })
            .catch((err) => {
                console.error("error", err);
            });
    };

    const onFinish = (values: any) => {
        signupService(values)
            .then((response) => {
                message.success(response.data.msg);
                form.resetFields();
                signin(values.username, values.password);
            })
            .catch((error) => {
                message.error(error?.response?.data?.msg ?? "Falhou em criar usuário");
            });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.error("Failed:", errorInfo);
    };

    return (
        <Form
            form={form}
            layout="horizontal"
            name="register-form"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item label="Nome" name="name" rules={[{ required: true, message: "Por favor insira sua senha!" }]}>
                <Input />
            </Form.Item>
            <Form.Item
                label="Sobrenome"
                name="last_name"
                rules={[{ required: true, message: "Por favor insira sua senha!" }]}
            >
                <Input />
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
                <Input />
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
                <Input />
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
                <Input.Password />
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
                <Input.Password />
            </Form.Item>
            <Button
                style={{
                    float: "right",
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
