import { RANK_MESSAGE_REF } from "@/app/internal/rank/vote/page";
import { QuestionData, setQuestionVote } from "@/lib/features/classification";
import { useAppDispatch } from "@/lib/hooks";
import { Button, Card, message, Rate } from "antd";

interface IQuestionProps {
    question: QuestionData;
    text: string[];
    hasNext: boolean;
    hasPrevious: boolean;
    nextQuestion: () => void;
    previousQuestion: () => void;
}

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
        <>
            <Card title={question.question_text}>
                <div>{question.question_details}</div>
                <Rate tooltips={text} onChange={setVote} value={question.vote} />
                {question.vote ? <span>{text[question.vote - 1]}</span> : null}
            </Card>
            <Button disabled={!hasPrevious} onClick={previousQuestion}>
                Anterior
            </Button>
            <Button disabled={!hasNext} onClick={skipQuestion}>
                Pular
            </Button>
            <Button type="primary" onClick={voteQuestion} disabled={!hasNext}>
                Proximo
            </Button>
        </>
    );
};

export default Question;
