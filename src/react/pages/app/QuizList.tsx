import { FaPlus } from "react-icons/fa";
import { useAppRouter } from "../../utils/store";
import { Button } from "react-daisyui";
import { MdLeaderboard } from "react-icons/md";
import { TitleBar } from "../../components/TitleBar";
import { useEffect, useState } from "react";
import { getQuizList, type Quiz } from "../../utils";
import { QuizCard } from "../../components/QuizCard";

export const QuizList = () => {

    const { navigate } = useAppRouter()
    const [quizes, setQuizes] = useState<Quiz[]>([]);

    useEffect(() => {
        getQuizList().then((res) => {
            setQuizes(res);
        });
    });

    return <div className="h-full">
        <TitleBar title="Quizes" actions={[
            <Button className="btn-circle mr-4" onClick={() => navigate("leaderboard")} >
                <MdLeaderboard size={32} />
            </Button>,
            <Button className="btn-circle" onClick={() => navigate("add-quiz")} >
                <FaPlus size={25} />
            </Button>]}
        />

        <div className="flex flex-col gap-4 mt-8">
            {quizes && quizes.map(q => (<QuizCard key={q.quizId} quiz={q}></QuizCard>))}
        </div>
    </div>
}