import { FaPlus } from "react-icons/fa";
import { useAppRouter } from "../../utils/store";
import { Button } from "react-daisyui";
import { MdLeaderboard } from "react-icons/md";
import { TitleBar } from "../../components/TitleBar";

export const QuizList = () => {

    const { navigate } = useAppRouter()

    return <div className="h-full">
        <TitleBar title="Quizes" actions={[
            <Button className="btn-circle mr-4" onClick={()=>navigate("leaderboard")} >
                <MdLeaderboard size={32} />
            </Button>,
            <Button className="btn-circle" onClick={()=>navigate("add-quiz")} >
                <FaPlus size={25} />
            </Button>]}
        />
    </div>
}