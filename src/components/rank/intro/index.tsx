import { ClassProfile, setSelectedBdoClass } from "@/lib/features/classification";
import { useAppDispatch } from "@/lib/hooks";
import { Button, Card, Divider, Select, Steps } from "antd";
import styles from "./intro.module.scss";
import { useState } from "react";

const Intro = ({ nextQuestion, bdoClass }: { nextQuestion: () => void; bdoClass: IClass[] }) => {
    const dispatch = useAppDispatch();

    const [selectedClass, setSelectedClass] = useState<number | undefined>(undefined);
    const [selectedProfile, setSelectedProfile] = useState<ClassProfile | undefined>(undefined);

    const handlerChangeBdoClass = (value: number) => {
        setSelectedClass(value);
    };

    const handlerChangeProfile = (value: ClassProfile) => {
        setSelectedProfile(value);
    };

    const selectItens = bdoClass.map((item) => ({
        value: item.id,
        label: item.abbreviation,
    }));

    const currentStep = selectedClass === undefined || selectedProfile === undefined ? 0 : 1;

    const startQuestion = () => {
        dispatch(setSelectedBdoClass({ class: selectedClass, profile: selectedProfile }));
        nextQuestion();
    };

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
                            value={selectedClass}
                            options={selectItens}
                            onChange={handlerChangeBdoClass}
                        />
                        <div>Selecione o perfil:</div>
                        <Select
                            placeholder="Selecione o perfil"
                            style={{ width: "100%" }}
                            value={selectedProfile}
                            options={[
                                { value: 1, label: "Despertar" },
                                { value: 2, label: "Sucessão" },
                            ]}
                            onChange={handlerChangeProfile}
                        />
                    </div>
                </div>
            </Card>
            <Button type="primary" onClick={startQuestion} disabled={currentStep === 0}>
                Começar
            </Button>
        </>
    );
};

export default Intro;
