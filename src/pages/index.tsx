import MenuHeader from "@/components/menuHeader"
import useMenuHeader from "@/components/menuHeader/useMenuHeader"
import SingupForm from "@/components/signup"
import LogoKawori from "@/public/kaori_logo4.png"
import { Button, Divider, List, Tabs, TabsProps } from "antd"
import { signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import styles from "./Home.module.scss"
import LoginPage from "./signin"

import Facetexture from "@/components/landing/facetexture"
import FAQ from '@/components/landing/FAQ'
import News from "@/components/landing/news"
import Welcome from "@/components/landing/welcome"
import { Footer } from "antd/lib/layout/layout"
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { createClient } from 'prismicio'

const tabItens: TabsProps["items"] = [
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

export default function Home({ pageList }: InferGetStaticPropsType<typeof getStaticProps>) {
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
                    <div className={styles["internal-page"]}>
                        <div className={styles["section"]}>
                            <Image alt="Kawori Logo" src={LogoKawori} className={styles["logo-image"]} width={500} />
                            {context.status === "authenticated" && (
                                <div className={styles["user-container"]}>
                                    <strong className={styles["form-title"]}>Usuario logado</strong>
                                    <div className={styles["user-options"]}>
                                        <div>Nome: {context.data?.user.name}</div>
                                        <div>
                                            Data de cadastro:{" "}
                                            {context.data?.user.dateJoined
                                                ? formatDate(context.data?.user.dateJoined)
                                                : ""}
                                        </div>
                                        <div>
                                            Ultimo login:{" "}
                                            {context.data?.user.lastLogin
                                                ? formatDate(context.data?.user.lastLogin)
                                                : ""}
                                        </div>
                                        <div>{context.data?.user.image}</div>
                                        <div>{context.data?.user.isActive}</div>
                                    </div>
                                    <div className={styles["access-list"]}>
                                        <List
                                            header={<strong>Acesso Rápido</strong>}
                                            bordered
                                            dataSource={[
                                                { text: "Perfil", link: "/admin/user" },
                                                { text: "Facetexture", link: "/admin/facetexture" },
                                            ]}
                                            renderItem={(item) => (
                                                <List.Item>
                                                    <Link href={item.link}>{item.text}</Link>
                                                </List.Item>
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <Button
                                            type="primary"
                                            danger
                                            onClick={() => signOut()}
                                            style={{
                                                float: "right",
                                            }}
                                        >
                                            Deslogar
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {context.status === "unauthenticated" && (
                                <div className={styles["tabs"]}>
                                    <Tabs centered items={tabItens} />
                                </div>
                            )}
                        </div>
                        <Divider />
                        <News data={pageList}/>
                        <Divider />
                        <Welcome />
                        <Facetexture />
                        <Divider />
                        <FAQ />
                        <Divider />
                    </div>
                </div>
            </div>
            <Footer style={{ textAlign: "center" }}>
                Sinta-se a vontade para entrar para
                <a target="_blank" href="https://discord.gg/fykNkXyn2r">
                    &nbsp;nossa comunidade&nbsp;
                </a>
                caso tenha alguma duvida ou sugestão!
            </Footer>
        </>
    );
}

export async function getStaticProps({ previewData }: GetStaticPropsContext) {
    // The `previewData` parameter allows your app to preview
    // drafts from the Page Builder.
    const client = createClient({ previewData });

    const page = await client.getAllByType("platform_news_1");

    const pageList = page.map(item => ({
        first_publication_date: item.first_publication_date,
        url: item.url,
        title: item.data.meta_title,
    }))

    return {
        props: { pageList },
    };
}