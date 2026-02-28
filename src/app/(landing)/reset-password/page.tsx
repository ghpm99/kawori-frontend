"use client";

import { useTheme } from "@/components/themeProvider/themeContext";
import { confirmPasswordReset, requestPasswordReset, validateResetToken } from "@/services/auth/resetPassword";
import { Button, Form, Input, Result, message } from "antd";
import { AxiosError } from "axios";
import LogoKawori from "assets/kaori_logo6.png";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styles from "./ResetPassword.module.scss";

type Step = "request" | "new-password" | "invalid-token" | "loading";

export default function ResetPassword() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const {
        state: { theme },
    } = useTheme();

    const token = searchParams.get("token");
    const [step, setStep] = useState<Step>(token ? "loading" : "request");
    const [submitting, setSubmitting] = useState(false);

    const validate = useCallback(async (t: string) => {
        try {
            await validateResetToken(t);
            setStep("new-password");
        } catch {
            setStep("invalid-token");
        }
    }, []);

    useEffect(() => {
        if (token) {
            validate(token);
        }
    }, [token, validate]);

    const handleRequestReset = async ({ email }: { email: string }) => {
        setSubmitting(true);
        try {
            await requestPasswordReset(email);
        } catch {
            // Show success message regardless to prevent email enumeration
        } finally {
            setSubmitting(false);
            message.success("Se o email estiver cadastrado, você receberá um link para redefinir sua senha.");
        }
    };

    const handleConfirmReset = async ({ new_password }: { new_password: string; confirm_password: string }) => {
        if (!token) return;
        setSubmitting(true);
        try {
            await confirmPasswordReset(token, new_password);
            message.success("Senha redefinida com sucesso!");
            router.push("/");
        } catch (err) {
            const axiosError = err as AxiosError<{ detail?: string }>;
            const detail = axiosError.response?.data?.detail;
            message.error(detail || "Erro ao redefinir senha. Tente novamente.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles["container"]}>
            <Image
                alt="Kawori Logo"
                src={LogoKawori}
                className={`${styles["logo-image"]} ${styles[theme]}`}
                width={500}
            />

            {step === "loading" && <Result title="Validando token..." />}

            {step === "invalid-token" && (
                <Result
                    status="error"
                    title="Token inválido ou expirado"
                    subTitle="Solicite um novo link de redefinição de senha."
                    extra={
                        <Button type="primary" onClick={() => router.push("/reset-password")}>
                            Solicitar novo link
                        </Button>
                    }
                />
            )}

            {step === "request" && (
                <div className={styles["form-wrapper"]}>
                    <h2>Redefinir senha</h2>
                    <p>Informe seu email para receber o link de redefinição.</p>
                    <Form onFinish={handleRequestReset} layout="vertical">
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: "Por favor insira seu email!" },
                                { type: "email", message: "Email inválido!" },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" loading={submitting} block>
                            Enviar
                        </Button>
                    </Form>
                </div>
            )}

            {step === "new-password" && (
                <div className={styles["form-wrapper"]}>
                    <h2>Nova senha</h2>
                    <Form onFinish={handleConfirmReset} layout="vertical">
                        <Form.Item
                            label="Nova senha"
                            name="new_password"
                            rules={[
                                { required: true, message: "Por favor insira a nova senha!" },
                                { min: 8, message: "A senha deve ter no mínimo 8 caracteres!" },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            label="Confirmar senha"
                            name="confirm_password"
                            dependencies={["new_password"]}
                            rules={[
                                { required: true, message: "Por favor confirme a senha!" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("new_password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("As senhas não coincidem!"));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" loading={submitting} block>
                            Redefinir senha
                        </Button>
                    </Form>
                </div>
            )}
        </div>
    );
}
