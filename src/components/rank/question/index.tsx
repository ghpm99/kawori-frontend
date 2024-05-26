import { QuestionData } from "@/lib/features/classification";
import { Rate } from "antd";
import { useState } from "react";

const Question = ({ question, text }: { question: QuestionData; text: string[] }) => {
    const [value, setValue] = useState(0);

    return (
        <>
            <div>{question.question_text}</div>
            <Rate tooltips={text} onChange={setValue} value={value} />
            {value ? <span>{text[value - 1]}</span> : null}
        </>
    );
};

export default Question;
