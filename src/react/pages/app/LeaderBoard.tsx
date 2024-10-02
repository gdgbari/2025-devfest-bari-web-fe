import { useState } from "react";
import { useAppRouter } from "../../utils/store";
import { Button } from "react-daisyui";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useLeaderboard } from "../../utils/query";
import { colorConverter } from "../../utils";
import { TbReload } from "react-icons/tb";
import { useQueryClient } from "@tanstack/react-query";

export const LeaderBoard = () => {

    const { navigate } = useAppRouter()
    const leaderBoard = useLeaderboard()

    const queryClient = useQueryClient()

    const [selectedLeaderboard, setSelectedLeaderboard] = useState<"users" | "groups">("users")

    const groupMax = leaderBoard.data?.groups.reduce((acc, group) => Math.max(acc, group.score), 0)


    return <div className="h-full">
        <div className="flex align-middle justify-center">
            <h1 className="text-5xl font-bold">Leaderboard</h1>
            <div className="flex-1" />
            <Button className="btn-circle mr-4" onClick={()=>queryClient.resetQueries({ queryKey:["leaderboard"] })} loading={leaderBoard.isFetching} disabled={leaderBoard.isFetching} >
                {!leaderBoard.isFetching &&<TbReload size={32} />}
            </Button>
            <Button className="btn-circle" onClick={()=>navigate("app")} >
                <IoMdArrowRoundBack size={32} />
            </Button>
        </div>
        <div className="mt-10 flex items-center justify-center flex-wrap">
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
            {leaderBoard.isLoading && <div>Loading...</div>}
            {
                selectedLeaderboard == "users"? leaderBoard.data?.users.sort( (a,b) => a.position-b.position ).map((user, i) => (
                    <div
                        key={i} className="flex justify-between items-center p-2 border rounded-xl mb-3 border-"
                        style={{borderColor: colorConverter(user.groupColor), borderWidth: "1px"}}
                    >
                        <div className="flex items-center">
                            <div
                                className="ml-2 rounded-full border w-[35px] h-[35px] items-center justify-center flex text-white"
                                style={{borderColor: colorConverter(user.groupColor), backgroundColor: colorConverter(user.groupColor)}}
                            >
                                <b>{user.position}°</b>
                            </div>
                            <div className="ml-5"><b>{user.nickname}</b></div>
                        </div>
                        <div className="mr-5"><b>{user.score} points</b></div>
                    </div>
                )) : 
                selectedLeaderboard == "groups" ? leaderBoard.data?.groups.sort( (a,b) => a.position-b.position ).map((group, i) => {
                    return <div className="flex-col mb-6">
                        <div
                            key={i} className="flex justify-center items-center p-2 h-[100px] mb-2 text-3xl"
                            style={{ width: `${(group.score / (groupMax??1)) * 100}%`, minWidth: "250px", backgroundColor: colorConverter(group.color), color: "white" }}
                        >
                            <b>{group.position}°</b>
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

