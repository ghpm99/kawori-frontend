import SingupForm from "components/signup";
import MenuHeader from "../components/menuHeader";
import styles from "./Home.module.scss";

export default function Home() {
    return (
        <>
            <div className={styles["container"]}>
                <MenuHeader />
                <div className={styles["body"]}>
                    <h1 className={styles["title"]}>
                        Você está a apenas um passo de um novo nivel de personalização do seu jogo!
                    </h1>
                    <div className={styles["signup-container"]}>
                        <div className={styles["text-container"]}>
                            <h1 className={styles["signup-text"]}>O cadastro é gratuito, simples e rapido.</h1>
                        </div>
                        <div className={styles["signup-form"]}>
                            <div className={styles["form-title"]}>Cadastro</div>
                            <SingupForm />
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
