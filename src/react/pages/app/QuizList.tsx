import { FaPlus } from "react-icons/fa";
import { useAppRouter } from "../../utils/store";
import { Button } from "react-daisyui";

export const QuizList = () => {

    const { navigate } = useAppRouter()

    return <div className="h-full">
        <div className="flex align-middle justify-center">
            <h1 className="text-5xl font-bold">Quizes</h1>
            <div className="flex-1" />
            <Button className="btn-circle" onClick={()=>navigate("add-quiz")} >
                <FaPlus size={25} />
            </Button>
        </div>
    </div>
}