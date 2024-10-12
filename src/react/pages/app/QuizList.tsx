import { FaPlus } from "react-icons/fa";
import { useAppRouter } from "../../utils/store";
import { Button, Checkbox } from "react-daisyui";
import { MdLeaderboard } from "react-icons/md";
import { TitleBar } from "../../components/TitleBar";
import { QuizCard } from "../../components/QuizCard";
import { useQuizes } from "../../utils/query";
import { BsQrCodeScan } from "react-icons/bs";
import { Space } from "@mantine/core";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TbReload } from "react-icons/tb";

export const QuizList = () => {

    const { navigate } = useAppRouter()

    const quizes = useQuizes()
    const [showHidden, setShowHidden] = useState(false)
    const queryClient = useQueryClient()

    return <div className="h-full">
        <TitleBar title="Quizes" actions={[
            <Button className="btn-circle mr-4" onClick={() => queryClient.resetQueries()} loading={quizes.isFetching}>
                { !quizes.isFetching && <TbReload size={32} /> }
            </Button>,
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
        <div className="flex">
            <b>Show hidden: </b>
            <Checkbox className="ml-3 checkbox-white" size="md" onChange={(e)=>setShowHidden(e.target.checked)} checked={showHidden}/>
        </div>
        {quizes.isLoading && <div>Loading...</div>}
        <div className="flex flex-col gap-4 mt-8">
            {quizes && quizes.data?.filter(q => showHidden || q.type != "hidden").map(q => (<QuizCard key={q.quizId} quiz={q}></QuizCard>))}
        </div>
    </div>
}