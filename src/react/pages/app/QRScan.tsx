import { IoMdArrowRoundBack } from "react-icons/io"
import { TitleBar } from "../../components/TitleBar"
import { Button, Input, Loading } from "react-daisyui"
import { useAppRouter } from "../../utils/store"
import { Scanner } from '@yudiel/react-qr-scanner';
import { FaCamera } from "react-icons/fa";
import { FiCameraOff } from "react-icons/fi"
import { useState } from "react"
import { Space } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useUserProfile } from "../../utils/query"
import { addPointsToUsers, colorConverter } from "../../utils"
import { FaTrashAlt } from "react-icons/fa";
import { notifications } from "@mantine/notifications"
import { useQueryClient } from "@tanstack/react-query"
import { FaCheck } from "react-icons/fa";

const UserRowInfo = ({ uid, removeUser }: { uid: string, removeUser: (uid: string) => void }) => {
    const user = useUserProfile(uid)
    return <>
        <div
            className="flex justify-between items-center p-2 border rounded-xl mb-3 sm:flex-row flex-col"
            style={{borderColor: "#555", borderWidth: "1px"}}
        >
            <div className="flex items-center ml-3 justify-center gap-2">
                {user.data == null?<><b>{uid}</b><Loading /></>:<b>{user.data?.name} {user.data?.surname}</b>}
            </div>
            <div className="flex gap-4 sm:flex-row flex-col">
                <div className="flex-col flex justify-center sm:items-end items-center">
                    <small>{user.data?.email}</small>
                    <small>{user.data?.nickname}</small>
                </div>
                <Button style={{
                    backgroundColor: colorConverter("red")
                }} onClick={()=>removeUser(uid)} >
                    <FaTrashAlt size={26} />
                </Button>
            </div>
        </div>
    </>
    
}


export const QRScan = () => {

    const { navigate } = useAppRouter()
    
    const [isLoading, setIsLoading] = useState(false)
    const [enableCamera, setEnableCamera] = useState(true)
    const [addOrder, setAddOrder] = useState<{uid: string, date: Date}[]>([])
    const queryClient = useQueryClient()
    const form = useForm({
        initialValues: {
            title: "",
            value: 0,
            userIdList: [] as string[]
        },
        validate: {
            title: (value) => {
                if (value.length <= 0) {
                    return "Title must be at least 1 character long"
                }
                return undefined
            },
            value: (value) => {
                if (value < 0) {
                    return "Value must be greater than or equal to 0"
                }
                return undefined
            },
            userIdList: (value) => {
                if (value.length == 0) {
                    return "You must select at least one user"
                }
                return undefined
            }
        }
    })

    return <div className="h-full">
        <TitleBar title="QR-Scan" actions={[
                <Button className="btn-circle mr-4" onClick={() => setEnableCamera(!enableCamera)} >
                    {enableCamera?<FiCameraOff size={26} />:<FaCamera size={26} />}
                </Button>,
                <Button className="btn-circle mr-4" onClick={() => navigate("app")} >
                    <IoMdArrowRoundBack size={32} />
                </Button>,
                <Button
                    className="btn-circle"
                    disabled={isLoading}
                    onClick={() =>{
                        form.isValid()
                        form.onSubmit((data)=>{
                            notifications.show({
                                id: "add-points",
                                title: "Adding points",
                                message: "Adding points to users...",
                                autoClose: false,
                                loading: true
                            })
                            setIsLoading(true)
                            addPointsToUsers(data).then(()=>{
                                notifications.update({
                                    id: "add-points",
                                    title: "Success",
                                    loading: false,
                                    autoClose: 3000,
                                    message: "Points added successfully",
                                    color: "teal"
                                })
                                queryClient.invalidateQueries({ queryKey: ["quizzes"] })
                                navigate("app")
                            }).catch((e)=>{
                                notifications.update({
                                    id: "add-points",
                                    loading: false,
                                    autoClose: 3000,
                                    title: "Error",
                                    message: e.message,
                                    color: "red"
                                })
                            }).finally(()=>{
                                setIsLoading(false)
                            })
                        })()
                        if (!form.isValid()){
                            notifications.show({
                                id: "add-points",
                                title: "Please fill all the fields",
                                message: Object.values(form.errors).join(", "),
                                autoClose: 3000,
                                color: "red"
                            })
                        }
                    }}
                >
                    <FaCheck size={25} />
                </Button>
            ]}
        />
        <form>
            <Input
                placeholder="Bonus points description"
                className="input input-bordered w-full max-w-[95%] mt-8"
                {...form.getInputProps("title")}
            />
            <Input
                placeholder="Points to add"
                className="input input-bordered w-full max-w-[95%] mt-3"
                type="number"
                min={0}
                {...form.getInputProps("value")}
            />
            <div className="flex justify-center items-center my-5">
                <div style={{maxWidth: "400px"}}>
                    {enableCamera ? <Scanner
                        onScan={(result) => {
                            let usedUIDS = [...form.values.userIdList]
                            result.forEach((r) => {
                                
                                console.log(r.rawValue)
   
                                if (!r.rawValue.startsWith("user:")){
                                    return
                                }
                                const uid = r.rawValue.split(":")[1]
                                if (!usedUIDS.includes(uid)){
                                    usedUIDS.push(uid)
                                    form.setFieldValue("userIdList", (prev)=>{
                                        return [...new Set([uid, ...prev])]
                                    })
                                    if (addOrder.filter((o) => o.uid == uid).length == 0){
                                        addOrder.push({uid, date: new Date()})
                                    }
                                    
                                }else{
                                    console.log("User already added")
                                }
                            })
                        }}
                        allowMultiple
                        components={{
                            audio: false,
                            onOff: false,
                            finder: true,
                            torch: true,
                        }}
                    />: <div className="flex">Camera disabled<Space w="md" /><FiCameraOff size={26} /></div>}
                </div>
            </div>
            {form.values.userIdList.length == 0 && <div className="text-red-500">No users selected</div>}
            {form.values.userIdList.sort((a,b) => {
                if (addOrder.find((o) => o.uid == a) == undefined){
                    return 1
                }
                if (addOrder.find((o) => o.uid == b) == undefined){
                    return -1
                }
                return addOrder.find((o) => o.uid == b)!.date.getTime() - addOrder.find((o) => o.uid == a)!.date.getTime() 

            }).map((uid) => <UserRowInfo key={uid} uid={uid} removeUser={(uid_del)=>{
                form.setFieldValue("userIdList", form.values.userIdList.filter((uid) => uid != uid_del))
                setAddOrder(addOrder.filter((o) => o.uid != uid_del))
            }} />)}
        </form>
        <Space h="xl" />
</div>
}