import SingupForm from "@/components/signup";
import MenuHeader from "@/components/menuHeader";
import styles from "./Home.module.scss";
import LogoKawori from "@/public/kaori_logo3.jpg";
import Image from "next/image";
import { Button, List, Tabs, TabsProps, Typography } from "antd";
import LoginPage from "./signin";
import useMenuHeader from "@/components/menuHeader/useMenuHeader";
import AccountMenuInfo from "@/components/accountMenuInfo";
import Link from 'next/link'
import { signOut, useSession } from "next-auth/react";

const itens: TabsProps["items"] = [
    {
        key: "signup",
        label: "Cadastro",
        children: (
            <div className={styles["form-container"]}>
                <div className={styles["form-title"]}>Cadastro</div>
                <SingupForm />
            </div>
        ),
    },
    {
        key: "signin",
        label: "Login",
        children: (
            <div className={styles["form-container"]}>
                <div className={styles["form-title"]}>Login</div>
                <LoginPage />
            </div>
        ),
    },
];

export default function Home() {
    const context = useMenuHeader();
    const formatDate = (date: string) => {
        const dateFormat = new Date(date);
        return dateFormat.toLocaleString();
    };
    return (
        <>
            <div className={styles["container"]}>
                <MenuHeader />
                <div className={styles["body"]}>
                    <div className={styles["section"]}>
                        <Image alt="Kawori Logo" src={LogoKawori} className={styles["logo-image"]} width={500} />
                        {context.status === "authenticated" && (
                            <div className={styles["user-container"]}>
                                <div className={styles["form-title"]}>Usuario logado</div>
                                <div className={styles["user-options"]}>
                                    <div>Nome: {context.data?.user.name}</div>
                                    <div>
                                        Data de cadastro:{" "}
                                        {context.data?.user.dateJoined ? formatDate(context.data?.user.dateJoined) : ""}
                                    </div>
                                    <div>
                                        Ultimo login:{" "}
                                        {context.data?.user.lastLogin ? formatDate(context.data?.user.lastLogin) : ""}
                                    </div>
                                    <div>{context.data?.user.image}</div>
                                    <div>{context.data?.user.isActive}</div>
                                </div>
                                <div className={styles['access-list']}>
                                <List
                                    header={<div>Acesso Rápido</div>}
                                    bordered
                                    dataSource={[
                                        {text: 'Perfil', link: '/admin/user'},
                                        {text: 'Facetexture', link: '/admin/facetexture'},
                                    ]}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <Link href={item.link}>{item.text}</Link>
                                        </List.Item>
                                    )}
                                    />
                                    </div>
                                <div>
                                    <Button type="primary" danger onClick={() => signOut()} style={{
                                        float: "right",
                                    }}>
                                        Deslogar
                                    </Button>
                                </div>
                            </div>
                        )}
                        {context.status === "unauthenticated" && (
                            <div className={styles["tabs"]}>
                                <Tabs centered items={itens} />
                            </div>
                        )}
                    </div>
                    <h1 className={styles["title"]}>
                        Você está a apenas um passo de um novo nivel de personalização do seu jogo!
                    </h1>
                    <div className={styles["signup-container"]}>
                        <div className={styles["text-container"]}>
                            <h1 className={styles["signup-text"]}>O cadastro é gratuito, simples e rapido.</h1>
                        </div>
                        <div className={styles["text-container"]}>
                            <h1 className={styles["signup-text"]}>
                                Cadastre-se e estilize sua tela de seleção agora mesmo!
                            </h1>
                        </div>
                    </div>
                    <div className={styles["footer-text"]}>
                        Sinta-se a vontade para entrar para
                        <a target="_blank" href="https://discord.gg/fykNkXyn2r">
                            &nbsp;nossa comunidade&nbsp;
                        </a>
                        caso tenha alguma duvida ou sugestão!
                    </div>
                    <div className={styles["body-background"]} />
                </div>
            </div>
            <div className={styles["background"]} />
        </>
    );
}
