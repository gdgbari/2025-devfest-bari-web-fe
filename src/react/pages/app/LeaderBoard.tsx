import { useEffect, useState, type CSSProperties } from "react";
import { useAppRouter } from "../../utils/store";
import { Button, Checkbox } from "react-daisyui";
import { IoMdArrowRoundBack } from "react-icons/io";
import { capitalizeFirstLetter, colorConverter, COLORS_LIST, shuffle, useLeaderboard, type LeaderBoardUser } from "../../utils";
import { TitleBar } from "../../components/TitleBar";
import { Box, MultiSelect, NumberInput, Button as MantineButton, Modal, Chip, Container, Space, Switch } from "@mantine/core";
import ConfettiExplosion from 'react-confetti-explosion';
import { PiNavigationArrowDuotone } from "react-icons/pi";
import { set } from "firebase/database";

const UserRow = ({ user, pos, style, hidePoints }: { user: LeaderBoardUser, pos?: number, style?: CSSProperties, hidePoints?:boolean }) => {

    return <div
        className="flex justify-between items-center p-2 border rounded-xl w-full"
        style={{borderColor: colorConverter(user.groupColor), borderWidth: "1px", ...(style??{})}}
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
        <div className="mr-5">{ !hidePoints && <b>{user.score} points</b> }</div>
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
    const [finalUserToSelect, setFinalUserToSelect] = useState(1)
    const [userToSelect, setUserToSelect] = useState(1)
    const [instantSpinning, setInstantSpinning] = useState(false)

    const borderUsers = 2
    const usersInWheel = borderUsers*2+userToSelect

    useEffect(() => {
        if (wheelStatus == "spinning") {
            const copyOfArray = filteredAndSortedUsers.copyWithin(0,filteredAndSortedUsers.length)
            setFinalUserToSelect(userToSelect)
            setSpinningArray(shuffle(copyOfArray).splice(0, usersInWheel))
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
        setLastSpeed(lastSpeed + (lastSpeed < 80 ? 2 : lastSpeed < 150 ? 8 : lastSpeed < 300 ? 20 : 30))
        if (lastSpeed >= 500 || instantSpinning) {
            setWheelStatus("stopped")
            return
        }
        let nextElement:LeaderBoardUser
        while (true){
            nextElement = shuffle(filteredAndSortedUsers.copyWithin(0,filteredAndSortedUsers.length))[0]
            const elementToDelete = spinningArray[spinningArray.length-1]
            if (nextElement == elementToDelete || !spinningArray.includes(nextElement)) break
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

    useEffect(()=>{
        setInstantSpinning(false)
        setUserToSelect(1)
    }, [showWheel])

    const isUserSelected = (userIndex:number):boolean => {
        return (userIndex-borderUsers)<finalUserToSelect && (userIndex-borderUsers)>=0
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
            {selectedLeaderboard == "users" && <Box className="flex flex-col md:flex-row items-center justify-center md:gap-20 gap-10 px-10 pb-10">
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
                <Box className="flex md:flex-col flex-row justify-center items-center w-full gap-2">
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
                            const csv = filteredAndSortedUsers.map((user, pos) => `${pos+1},${user.nickname},${user.score},${user.timestamp},${groupByColor(user.groupColor)?.name}`).join("\n")
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
                    <UserRow key={i} user={user} pos={i} style={{ marginBottom: 10 }}/>
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
            <Box className="flex justify-center">
                {wheelStatus == "stopped" && <ConfettiExplosion colors={COLORS_LIST.map(ele => colorConverter(ele))} zIndex={10000} width={4000} height={"350vh"}/>}
            </Box>
            <Box className="flex gap-10 justify-center py-4">
                {usersToShow != -1 && <Chip disabled>{`Top ${usersToShow} users`}</Chip>}
                {groupFilter.length > 0 && <Chip disabled>{`Groups: ${groupFilter.map(ele => capitalizeFirstLetter(ele)).join(", ")}`}</Chip>}
            </Box>
            { wheelStatus != "not-started" &&  <Box className="flex flex-col gap-1 justify-center py-4 items-center my-10">
                {wheelStatus == "spinning" && <p className="text-2xl font-bold mb-2">Spinning...</p>}
                {wheelStatus == "stopped" && <p className="text-2xl font-bold mb-2">🎉 The winner is ...</p>}
                <Container size="sm" className="w-full">
                    {spinningArray.map((user, i) => (
                        <Box key={i} style={{ display: "flex", justifyContent:"center", alignItems: "center" }}>
                            <Box style={{ width: 80, display: "flex", justifyContent:"center", alignItems: "center" }}>
                                {isUserSelected(i) && <>
                                    <PiNavigationArrowDuotone style={{ rotate: "135deg"}} size={40} />
                                    <Space h="md" />
                                </>}
                            </Box>
                            <UserRow user={user} style={{ marginBottom: 10, marginTop: 10, opacity: isUserSelected(i)?1:0.4 }} hidePoints />
                        </Box>
                    ))}
                </Container>
            </Box> }
            <Box className="justify-center flex mt-[3vh] gap-5">
                {
                    wheelStatus != "spinning" && <NumberInput
                        onChange={(v) => v != "" && setUserToSelect(parseInt(v.toString()))}
                        value={userToSelect}
                        min={1}
                        label="Number of users to extract"
                        max={users.length-borderUsers*2}
                        step={1}
                    />
                }
                {
                    wheelStatus != "spinning" && <Switch
                        onChange={(v) => setInstantSpinning(v.target.checked)}
                        checked={instantSpinning}
                        className="mt-8"
                        label="Instant Spinning ™️"
                    />
                }
            </Box>
            <Box className="justify-center flex my-[10vh]">
                {wheelStatus != "spinning" && <MantineButton onClick={()=> setWheelStatus("spinning")} disabled={filteredAndSortedUsers.length == 0}>
                    {wheelStatus == "stopped"? "Spin the wheel again": "Spin the wheel"}
                </MantineButton>}
            </Box>
        
        </Modal>




    </div>
}

