import { useEffect, useState } from "react";
import { useAppRouter } from "../../utils/store";
import { Button, Checkbox } from "react-daisyui";
import { IoMdArrowRoundBack } from "react-icons/io";
import { capitalizeFirstLetter, colorConverter, shuffle, useLeaderboard, type LeaderBoardUser } from "../../utils";
import { TitleBar } from "../../components/TitleBar";
import { Box, MultiSelect, NumberInput, Button as MantineButton, Modal, Chip, Container } from "@mantine/core";

const UserRow = ({ user, pos }: { user: LeaderBoardUser, pos?: number }) => {
    return <div
        className="flex justify-between items-center p-2 border rounded-xl mb-3 w-full"
        style={{borderColor: colorConverter(user.groupColor), borderWidth: "1px"}}
    >
        <div className="flex items-center">
            <div
                className="ml-2 rounded-full border w-[35px] h-[35px] items-center justify-center flex text-white"
                style={{borderColor: colorConverter(user.groupColor), backgroundColor: colorConverter(user.groupColor)}}
            >
                <b>{pos != null ? `${pos+1}°`: user.nickname[0].toUpperCase()}</b>
            </div>
            <div className="ml-5"><b>{user.nickname}</b></div>
        </div>
        <div className="mr-5"><b>{user.score} points</b></div>
    </div>
}

export const LeaderBoard = () => {

    const { navigate } = useAppRouter()
    const leaderBoard = useLeaderboard()

    const groups = Object.values(leaderBoard?.groups??{})
    const users = Object.values(leaderBoard?.users??{})

    const [selectedLeaderboard, setSelectedLeaderboard] = useState<"users" | "groups">("users")
    const groupMax = groups.reduce((acc, group) => Math.max(acc, group.score), 0)
    const [groupFilter, setGroupFilter] = useState<string[]>([])
    const [usersToShow, setUsersNumber] = useState<number>(-1)
    const [showWheel, setShowWheel] = useState(false)
    const [wheelStatus, setWheelStatus] = useState<"spinning" | "stopped" | "not-started">("not-started")
    const [spinningArray, setSpinningArray] = useState<LeaderBoardUser[]>([])
    const [wheelTrigger, setWheelTrigger] = useState(false)
    const [lastSpeed, setLastSpeed] = useState(0)

    useEffect(() => {
        if (wheelStatus == "spinning") {
            const copyOfArray = filteredAndSortedUsers.copyWithin(0,filteredAndSortedUsers.length)
            setSpinningArray(shuffle(copyOfArray).splice(0, 6))
            setLastSpeed(0)
            setWheelTrigger(!wheelTrigger)
        }
    }, [wheelStatus])

    useEffect(() => {
        setWheelStatus("not-started")
        setSpinningArray([])
        setLastSpeed(0)
    }, [showWheel])

    useEffect(() => {
        if (!showWheel || wheelStatus != "spinning") return
        setLastSpeed(lastSpeed + (lastSpeed < 150 ? 2 : lastSpeed < 300 ? 5 : lastSpeed < 500 ? 10 : 30))
        const nextElement = shuffle(filteredAndSortedUsers.copyWithin(0,filteredAndSortedUsers.length))[0]
        if (lastSpeed >= 800) {
            setWheelStatus("stopped")
            setSpinningArray([nextElement])
            return
        }
        setSpinningArray((prev) => [nextElement, ...prev.splice(0, prev.length-1)])
        setTimeout(()=>setWheelTrigger(!wheelTrigger), lastSpeed)
    }, [wheelTrigger])

    const sortLogic = (a: { score: number, timestamp: number, name:string }, b: { score: number, timestamp: number, name:string }) => {
        const diff_point = b.score - a.score
        if (diff_point != 0) return diff_point
        const diff_time = a.timestamp - b.timestamp
        if (diff_time != 0) return diff_time
        return a.name.localeCompare(b.name)
    }

    const groupByColor = (color: string) => {
        const res = groups.filter((group) => group.color == color)
        if (res.length == 0) return null
        return res[0]
    }

    const filteredAndSortedUsers = users.filter((ele)=>{
        //Group filtering
        if (groupFilter.length == 0) return true
        const userGroup = groupByColor(ele.groupColor)
        if (userGroup == null) return false
        return groupFilter.includes(userGroup.name)
    }).sort((a, b) => sortLogic({...a, name:a.nickname}, {...b, name:b.nickname})).slice(0,usersToShow == -1?undefined:usersToShow)

    const sortedGroups = groups.sort(sortLogic)

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
            {selectedLeaderboard == "users" && <Box className="flex items-center justify-center gap-20 px-10 pb-10">
                <MultiSelect
                    label="Filter by groups"
                    className="w-full"
                    placeholder="Group1, ..."
                    data={[...groups.map(group => ({ value: group.name, label: capitalizeFirstLetter(group.name) }))]}
                    searchable
                    value={groupFilter}
                    onChange={setGroupFilter}
                />
                <Box className="flex justify-center items-center w-full">
                    <Checkbox
                        className="checkbox checkbox-white mt-7 mr-4"
                        checked={usersToShow != -1}
                        onChange={(e) => setUsersNumber(e.target.checked ? users.length : -1)}
                    />
                    <NumberInput
                        label="Number of users to display"
                        placeholder="All"
                        className="w-full"
                        value={usersToShow == -1 ? users.length : usersToShow}
                        onChange={(v) => v != "" && setUsersNumber(parseInt(v.toString()))}
                        min={1}
                        max={users.length}
                        step={1}
                        disabled={usersToShow == -1}
                    />
                </Box>
                <Box className="flex flex-col justify-center items-center w-full gap-2">
                    <MantineButton
                        className="w-full"
                        size="sm"
                        onClick={()=>setShowWheel(true)}
                    >
                        Wheel of Fortune
                    </MantineButton>
                    <MantineButton
                        className="w-full"
                        size="s"
                        onClick={() => {
                            const csv = users.map((user, pos) => `${pos+1},${user.nickname},${user.score},${user.timestamp},${groupByColor(user.groupColor)?.name}`).join("\n")
                            const blob = new Blob(["Position,Nickname,Score,LastSubmission,GroupName\n"+csv], { type: "text/csv" })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement("a")
                            a.href = url
                            a.download = "leaderboard.csv"
                            a.click()
                        }}
                    >
                        Export CSV
                    </MantineButton>
                </Box>
            </Box>}
            {leaderBoard == null && <div>Loading...</div>}
            {
                selectedLeaderboard == "users"? filteredAndSortedUsers.map((user, i) => (
                    <UserRow key={i} user={user} pos={i}/>
                )) : 
                selectedLeaderboard == "groups" ? sortedGroups.map((group, i) => {
                    return <div className="flex-col mb-6" key={i}>
                        <div
                            key={i} className="flex justify-center items-center p-2 h-[100px] mb-2 text-3xl"
                            style={{ width: `${(groupMax==0?0:(group.score / (groupMax??1))) * 100}%`, minWidth: "50px", backgroundColor: colorConverter(group.color), color: "white" }}
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
        <Modal opened={showWheel} onClose={()=>setShowWheel(false)} fullScreen className="flex justify-center items-center h-full">
            <p className="text-3xl font-bold justify-center flex">Wheel of Fortune 🍀</p>
            <Box className="flex gap-10 justify-center py-4">
                {usersToShow != -1 && <Chip>{`Top ${usersToShow} users`}</Chip>}
                {groupFilter.length > 0 && <Chip>{`Groups: ${groupFilter.join(", ")}`}</Chip>}
            </Box>
            { wheelStatus != "not-started" &&  <Box className="flex flex-col gap-1 justify-center py-4 items-center my-10">
                {wheelStatus == "spinning" && <p className="text-2xl font-bold mb-2">Spinning...</p>}
                {wheelStatus == "stopped" && <p className="text-2xl font-bold mb-2">🎉 The winner is ...</p>}
                <Container size="sm" className="w-full">
                    {spinningArray.map((user, i) => (
                    <UserRow key={i} user={user} />
                    ))}
                </Container>
            </Box> }

            <Box className="justify-center flex mt-[20vh]">
                {wheelStatus != "spinning" && <MantineButton onClick={()=> setWheelStatus("spinning")}>
                    {wheelStatus == "stopped"? "Spin the wheel again": "Spin the wheel"}
                </MantineButton>}
            </Box>
        
        </Modal>




    </div>
}

