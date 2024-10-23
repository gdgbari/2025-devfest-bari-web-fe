import { FaPlus } from "react-icons/fa";
import { useAppRouter } from "../../utils/store";
import { Button, Checkbox, Loading } from "react-daisyui";
import { MdLeaderboard } from "react-icons/md";
import { TitleBar } from "../../components/TitleBar";
import { QuizCard } from "../../components/QuizCard";
import { useQuizzes } from "../../utils/query";
import { BsQrCodeScan } from "react-icons/bs";
import { SegmentedControl, Space } from "@mantine/core";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TbReload } from "react-icons/tb";
import { capitalizeString, QUIZ_TYPES } from "../../utils";

export const QuizList = () => {

    const { navigate } = useAppRouter()

    const quizzes = useQuizzes()
    const [filterSelected, setFilterSelected] = useState("talk")
    const queryClient = useQueryClient()
    const filteredQuizzes = quizzes.data?.filter(q => filterSelected == "all" || q.type == filterSelected)

    return <div className="h-full mb-5">
        <TitleBar title="Quizzes" actions={[
            <Button className="btn-circle mr-4" onClick={() => queryClient.invalidateQueries()} loading={quizzes.isFetching}>
                { !quizzes.isFetching && <TbReload size={32} /> }
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
        <SegmentedControl
            data={[
                ...QUIZ_TYPES.map(t => ({ value: t, label: capitalizeString(t) })),
                { value: "all", label: "All" },
            ]}
            onChange={(value) => setFilterSelected(value)}
            value={filterSelected}
        />
        <Space h="md" />
        {quizzes.isLoading && <Loading />}
        <div className="flex flex-col gap-4 mt-8">
            {filteredQuizzes && filteredQuizzes.length == 0 && <b className="text-2xl">No quizzes found :{"("}</b>}
            {filteredQuizzes && filteredQuizzes.map(q => (<QuizCard key={q.quizId} quiz={q}></QuizCard>))}
        </div>
    </div>
}