import SingupForm from "@/components/signup";
import MenuHeader from "@/components/menuHeader";
import styles from "./Home.module.scss";
import LogoKawori from "@/public/kaori_logo3.jpg";
import Image from "next/image";
import { Tabs, TabsProps } from "antd";
import LoginPage from "./signin";

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
    return (
        <>
            <div className={styles["container"]}>
                <MenuHeader />
                <div className={styles["body"]}>
                    <div className={styles["section"]}>
                        <Image alt="Kawori Logo" src={LogoKawori} className={styles["logo-image"]} width={500} />
                        <div className={styles["tabs"]}>
                            <Tabs centered items={itens} />
                        </div>
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
