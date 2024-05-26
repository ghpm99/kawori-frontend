import { Button, Card } from "antd";

const Intro = ({ nextQuestion }: { nextQuestion: () => void }) => {
    return (
        <>
            <Card title="Votação de classe">
                <div>Para votar primeiro selecione a classe que voce deseja votar.</div>
                <div>Após isso será exibido questões para avaliação da classe, vote clicando nas estrelas.</div>
                <div>Quanto maior o numero de estrelas, melhor a classe é naquela questao.</div>
                <div>Caso nao deseja votar naquela questão basta clicar em pular.</div>
                <div>Não existe limite de tempo!</div>
            </Card>
            <Button type="primary" onClick={nextQuestion}>
                Começar
            </Button>
        </>
    );
};

export default Intro;
