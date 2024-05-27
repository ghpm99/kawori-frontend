import { setSelectedBdoClass } from "@/lib/features/classification";
import { useAppDispatch } from "@/lib/hooks";
import { Button, Card, Divider, Select, Steps } from "antd";
import styles from "./intro.module.scss";

const Intro = ({
    nextQuestion,
    bdoClass,
    selectedBdoClass,
}: {
    nextQuestion: () => void;
    bdoClass: IClass[];
    selectedBdoClass: IClass | undefined;
}) => {
    const dispatch = useAppDispatch();

    const handlerChangeBdoClass = (value: number) => {
        dispatch(setSelectedBdoClass(value));
    };

    const selectItens = bdoClass.map((item) => ({
        value: item.id,
        label: item.abbreviation,
    }));

    const currentStep = selectedBdoClass === undefined ? 0 : 1;

    return (
        <>
            <Card title={<h2>Votação de classe</h2>}>
                <div className={styles["text"]}>
                    <Steps
                        direction="vertical"
                        current={currentStep}
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
                    <Divider />
                    <div className={styles["bdo-class"]}>
                        <div>Selecione a classe:</div>
                        <Select
                            placeholder="Selecione a classe"
                            style={{ width: "100%" }}
                            value={selectedBdoClass?.id}
                            options={selectItens}
                            onChange={handlerChangeBdoClass}
                        />
                    </div>
                </div>
            </Card>
            <Button type="primary" onClick={nextQuestion} disabled={!selectedBdoClass}>
                Começar
            </Button>
        </>
    );
};

export default Intro;
