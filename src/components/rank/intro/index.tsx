import { Button, Card, Steps } from "antd";
import styles from "./intro.module.scss";

const Intro = ({ nextQuestion }: { nextQuestion: () => void }) => {
    return (
        <>
            <Card title={<h2>Votação de classe</h2>}>
                <div className={styles["text"]}>
                    <Steps
                        direction="vertical"
                        current={0}
                        items={[
                            {
                                title: "Selecione a classe!",
                                description: "Selecione a classe para votar",
                            },
                            {
                                title: "Leia a pergunta!",
                                description: "Vote clicando nas estrelas, quanto melhor naquele cenario mais estrelas",
                            },
                            {
                                title: "Vote!",
                                description:
                                    "Clique em proximo para salvar o voto ou pular para nao votar aquela pergunta",
                            },
                        ]}
                    />
                    <div>Não existe limite de tempo!</div>
                </div>
            </Card>
            <Button type="primary" onClick={nextQuestion}>
                Começar
            </Button>
        </>
    );
};

export default Intro;
