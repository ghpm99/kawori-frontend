import Image from "next/image";
import styles from "./facetexture.module.scss";
import facetextureImage1 from "@/public/facetexture-1.png";
import facetextureImage2 from "@/public/facetexture-2.png";
import facetextureImage3 from "@/public/facetexture-3.png";
import facetextureImage4 from "@/public/facetexture-4.png";

const Facetexture = () => {
    return (
        <div className={styles["container"]}>
            <div className={styles["section"]}>
                <div className={styles["item-left"]}>
                    <Image alt="Facetexture" className={styles["image"]} src={facetextureImage1} />
                </div>
                <div className={styles["item-right"]}>
                    <h2 className={styles["text"]}>
                        Com a Kawori você pode personalizar a tela de seleção de personagens do seu jogo favorito com
                        sua imagem de preferencia, deixando seu jogo mais unico e especial.
                    </h2>
                </div>
            </div>
            <div className={styles["section"]}>
                <div className={styles["item-left"]}>
                    <h2 className={styles["text"]}>
                        Você está a apenas um passo de um novo nivel de personalização do seu jogo!
                    </h2>
                </div>
                <div className={styles["item-right"]}>
                    <Image alt="Facetexture" className={styles["image"]} src={facetextureImage2} />
                </div>
            </div>
            <div className={styles["section"]}>
                <div className={styles["item-left"]}>
                    <Image alt="Facetexture" className={styles["image"]} src={facetextureImage3} />
                </div>
                <div className={styles["item-right"]}>
                    <h2 className={styles["text"]}>O cadastro é gratuito, simples e rapido.</h2>
                </div>
            </div>
            <div className={styles["section"]}>
                <div className={styles["item-left"]}>
                    <h2 className={styles["text"]}>Cadastre-se e estilize sua tela de seleção agora mesmo!</h2>
                </div>
                <div className={styles["item-right"]}>
                    <Image alt="Facetexture" className={styles["image"]} src={facetextureImage4} />
                </div>
            </div>
        </div>
    );
};

export default Facetexture;
