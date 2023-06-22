import Link from "next/link";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Engine, ISourceOptions } from "tsparticles-engine";

import particlesOptions from "../../../public/particles.json";
import MenuHeader from "../../components/menuHeader";
import styles from "./Facetexture.module.scss";

export default function Facetexture() {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadFull(engine);
    }, []);

    return (
        <div className={styles["container"]}>
            <div className={styles["body"]}>
                <MenuHeader />
                <div className={styles["card-container"]}>
                    <div className={styles["card"]}>
                        <h1>
                            Face Texture Editor é um programa simples que
                            auxilia a alterar as Face Texture dos personagens do
                            Black Desert Online, criando assim um visual belo
                        </h1>
                        <img src={"/facetexture-1.png"} />
                    </div>
                    <div className={styles["card"]}>
                        <img src={"/facetexture-2.png"} />
                        <h1>
                            De forma facil e simples personalize a seleção de
                            personagem de seu jogo!
                        </h1>
                    </div>
                    <div className={styles["card"]}>
                        <h1>
                            Utilize qualquer imagem para uma personalização
                            completa!
                        </h1>
                        <img src={"/facetexture-3.png"} />
                    </div>
                    <div className={styles["card"]}>
                        <img src={"/facetexture-4.png"} />
                        <h1>
                            Surpreenda seus amigos com sua seleção de
                            personagem!
                        </h1>
                    </div>
                </div>
                <div className={styles["footer"]}>
                    <Link
                        className={styles["experiment-button"]}
                        href={"/admin/facetexture"}>
                        Experimente agora
                    </Link>
                </div>
            </div>
            <Particles
                options={particlesOptions as ISourceOptions}
                init={particlesInit}
            />
        </div>
    );
}
