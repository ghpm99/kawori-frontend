import { QuestionData, setQuestionVote } from "@/lib/features/classification";
import { useAppDispatch } from "@/lib/hooks";
import { Button, Card, message, Rate } from "antd";
import styles from "./question.module.scss";

interface IQuestionProps {
    question: QuestionData;
    text: string[];
    hasNext: boolean;
    hasPrevious: boolean;
    nextQuestion: () => void;
    previousQuestion: () => void;
}

const RANK_MESSAGE_REF: string = "rank-message-ref";

const Question = ({ question, text, hasNext, hasPrevious, nextQuestion, previousQuestion }: IQuestionProps) => {
    const dispatch = useAppDispatch();

    const setVote = (value: number) => {
        dispatch(
            setQuestionVote({
                id: question.id,
                vote: value,
            }),
        );
    };

    const skipQuestion = () => {
        message.info({
            content: "Questão pulada",
            key: RANK_MESSAGE_REF,
        });
        nextQuestion();
    };

    const voteQuestion = () => {
        message.success({
            content: "Voto registrado com sucesso!",
            key: RANK_MESSAGE_REF,
        });
        nextQuestion();
    };

    return (
        <div className={styles["question"]}>
            <Card title={<h2>{question.question_text}</h2>}>
                <div>{question.question_details}</div>
                <Rate tooltips={text} onChange={setVote} value={question.vote} />
                {question.vote ? <span>{text[question.vote - 1]}</span> : null}
            </Card>
            <div className={styles["button-container"]}>
                <Button disabled={!hasPrevious} onClick={previousQuestion}>
                    Anterior
                </Button>
                <div className={styles["next-buttons"]}>
                    <Button disabled={!hasNext} onClick={skipQuestion}>
                        Pular
                    </Button>
                    <Button type="primary" onClick={voteQuestion} disabled={!hasNext}>
                        Proximo
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Question;
