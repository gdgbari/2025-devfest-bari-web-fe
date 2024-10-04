import { useState } from "react";
import { useAppRouter } from "../../utils/store";
import { Button } from "react-daisyui";
import { IoMdArrowRoundBack } from "react-icons/io";
import { colorConverter, useLeaderboard } from "../../utils";
import { TitleBar } from "../../components/TitleBar";

export const LeaderBoard = () => {

    const { navigate } = useAppRouter()
    const leaderBoard = useLeaderboard()

    const groups = Object.values(leaderBoard?.groups??{})
    const users = Object.values(leaderBoard?.users??{})

    const [selectedLeaderboard, setSelectedLeaderboard] = useState<"users" | "groups">("users")
    const groupMax = groups.reduce((acc, group) => Math.max(acc, group.score), 0)

    const sortLogic = (a: { score: number, timestamp: number }, b: { score: number, timestamp: number }) => {
        const diff_point = b.score - a.score
        if (diff_point != 0) return diff_point
        return a.timestamp - b.timestamp
    }

    return <div className="h-full">

        <TitleBar title="Leaderboard" actions={[
            <Button className="btn-circle" onClick={()=>navigate("app")} >
                <IoMdArrowRoundBack size={32} />
            </Button>]}
        />
        <div className="mt-16 flex items-center justify-center flex-wrap gap-5">
            <Button
                type="button" color={selectedLeaderboard=="users"?"primary":"neutral"}
                className="w-[250px] !text-lg !p-0 mx-5" size="sm"
                onClick={() => setSelectedLeaderboard("users")}
            >
                Users
            </Button>
            <Button
                type="button" color={selectedLeaderboard=="groups"?"primary":"neutral"} 
                className="w-[250px] !text-lg !p-0 mx-5" size="sm"
                onClick={() => setSelectedLeaderboard("groups")}
            >
                Groups
            </Button>
        </div>
        <div className="mt-10">
            {leaderBoard == null && <div>Loading...</div>}
            {
                selectedLeaderboard == "users"? users.sort(sortLogic).map((user, i) => (
                    <div
                        key={i} className="flex justify-between items-center p-2 border rounded-xl mb-3 border-"
                        style={{borderColor: colorConverter(user.groupColor), borderWidth: "1px"}}
                    >
                        <div className="flex items-center">
                            <div
                                className="ml-2 rounded-full border w-[35px] h-[35px] items-center justify-center flex text-white"
                                style={{borderColor: colorConverter(user.groupColor), backgroundColor: colorConverter(user.groupColor)}}
                            >
                                <b>{i+1}°</b>
                            </div>
                            <div className="ml-5"><b>{user.nickname}</b></div>
                        </div>
                        <div className="mr-5"><b>{user.score} points</b></div>
                    </div>
                )) : 
                selectedLeaderboard == "groups" ? groups.sort(sortLogic).map((group, i) => {
                    return <div className="flex-col mb-6" key={i}>
                        <div
                            key={i} className="flex justify-center items-center p-2 h-[100px] mb-2 text-3xl"
                            style={{ width: `${(group.score / (groupMax??1)) * 100}%`, minWidth: "50px", backgroundColor: colorConverter(group.color), color: "white" }}
                        >
                            <b>{i+1}°</b>
                        </div>
                        <div className="text-left">
                            <b>Team {group.name}</b>: {group.score} points
                        </div>
                    </div>
                }) : null
            }
        </div>




    </div>
}

