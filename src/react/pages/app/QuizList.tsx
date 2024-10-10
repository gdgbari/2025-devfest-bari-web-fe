import { FaPlus } from "react-icons/fa";
import { useAppRouter } from "../../utils/store";
import { Button } from "react-daisyui";
import { MdLeaderboard } from "react-icons/md";
import { TitleBar } from "../../components/TitleBar";
import { QuizCard } from "../../components/QuizCard";
import { useQuizes } from "../../utils/query";
import { BsQrCodeScan } from "react-icons/bs";
import { Space } from "@mantine/core";


export const QuizList = () => {

    const { navigate } = useAppRouter()

    const quizes = useQuizes()

    return <div className="h-full">
        <TitleBar title="Quizes" actions={[
            <Button className="btn-circle mr-4" onClick={() => navigate("qrscan")} >
                <BsQrCodeScan size={26} />
            </Button>,
            <Button className="btn-circle mr-4" onClick={() => navigate("leaderboard")} >
                <MdLeaderboard size={32} />
            </Button>,
            <Button className="btn-circle" onClick={() => navigate("add-quiz")} >
                <FaPlus size={25} />
            </Button>]}
        />
        <Space h="md" />
        {quizes.isLoading && <div>Loading...</div>}
        <div className="flex flex-col gap-4 mt-8">
            {quizes && quizes.data?.map(q => (<QuizCard key={q.quizId} quiz={q}></QuizCard>))}
        </div>
    </div>
}