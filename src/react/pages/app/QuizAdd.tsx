import { Button, Input, Radio, Select } from "react-daisyui"
import { useAppRouter } from "../../utils/store"
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { notifications, showNotification } from "@mantine/notifications";
import { IoMdArrowRoundBack } from "react-icons/io";
import { createQuiz } from "../../utils";
import { TitleBar } from "../../components/TitleBar";
import { useQueryClient } from "@tanstack/react-query";

export const QuizAdd = () => {

    const { navigate } = useAppRouter()
    const [submitting, setSubmitting] = useState(false)

    const talks = [
        { label: "Talk 1", value: "talk1" },
        { label: "Talk 2", value: "talk2" },
        { label: "Talk 3", value: "talk3" },
        { label: "Talk 4", value: "talk4" },
        { label: "Talk 5", value: "talk5" }
    ]



    const [numOfQuizes, setNumOfQuizes] = useState(3)
    const [selectedQuiz, setSelectedQuiz] = useState(0)

    const getPage = () => {
        if (selectedQuiz >= numOfQuizes) return numOfQuizes - 1
        if (selectedQuiz < 0) return 0
        return selectedQuiz
    }

    const quizes = Array.from({ length: numOfQuizes }, (_, i) => i)
    const answers = Array.from({ length: 4 }, (_, i) => i)

    const baseTalkPoints = 30

    useEffect(() => {
        if (selectedQuiz >= numOfQuizes){
            setSelectedQuiz(numOfQuizes - 1)
        }
    }, [numOfQuizes, selectedQuiz])


    const queryClient = useQueryClient()

    const changeAnswareNumber = (qNum: number) => {

        form.setFieldValue("questions", form.values.questions.filter((q, i) => i < qNum))

        Array.from({ length: qNum }).forEach((q, i) => {
            if (form.values.questions[i] == null){
                form.setFieldValue(`questions.${i}`, {
                    question: "",
                    options: answers.map((i)=> ({ text: "", isCorrect: i==0 })),
                    value: "0"
                })
            }
        })
        setNumOfQuizes(qNum)
        
    }

    const form = useForm({
        initialValues: {
            title: "",
            type: "talk",
            questions: quizes.map((_qNum) => ({
                question: "",
                options: answers.map((i)=> ({ text: "", isCorrect: i==0 })),
                value: "0"
            })),
        },
        validate: {
            title: (value) => value.length > 0 ? undefined : "Title is required",
            type: (value) => (value == "talk" || value == "sponsor" || value == "hidden" || value == "special")? undefined : "Invalid type",
            questions: (value) => {
                let error: undefined|string = undefined
                value.forEach((q, i) => {
                    if (parseInt(q.value) <= 0 && form.values.type != "talk") {
                        return error = `Value of question ${i+1} is required`
                    }
                    if (q.question.length == 0) {
                        return error = `Question title of ${i+1} is required`
                    }
                    let correctSet = false
                    q.options.forEach((o, j) => {
                        if (o.text.length == 0) return error = `Option ${j+1} of question ${i+1} is required`
                        if (o.isCorrect){
                            if (!correctSet) correctSet = true
                            else return error = `Only one correct option is allowed for question ${i+1}`
                        }
                    })
                    if (error != null) return error
                    if (!correctSet) return error = `Correct option of question ${i+1} is required`
                })

                return error
            }
        },
        initialErrors: {
            title: "Title is required",
            type: "Invalid type",
            questions: "Questions are required"
        }
    })

    const checkErrors = () => {
        if (!form.isValid()) {
            showNotification({
                title: "Form error",
                message: Object.values(form.errors).join(", "),
                color: "red"
            })
        }
    }

    return <div className="flex-col h-full">
        <TitleBar title="Add Quiz" actions={[
                <Button className="btn-circle" onClick={()=>navigate("app")} >
                    <IoMdArrowRoundBack size={32} />
                </Button>
            ]}
        />
        <form onSubmit={form.onSubmit((data)=>{
            setSubmitting(true)
            notifications.show({
                id: "creating-quiz",
                title: "Creating quiz",
                message: "Please wait...",
                autoClose: false,
                color: "blue",
                loading: true
            })
            createQuiz({
                questionList: data.questions.map((q, i) => ({
                    text: q.question,
                    answerList: q.options.map(o => o.text),
                    correctAnswer: q.options.findIndex(o => o.isCorrect),
                    value: data.type == "talk" ? (baseTalkPoints/data.questions.length) : parseInt(q.value) 
                })),
                type: data.type,
                title: data.title,
            }).then((data: any) => {
                showNotification({
                    title: "Quiz created",
                    message: "Quiz has been created successfully",
                    color: "blue"
                })
                queryClient.resetQueries({ queryKey: ["quizes"] })
                navigate("app")
            }).catch((error) => {
                showNotification({
                    title: `Error creating quiz [${error.errorCode}]`,
                    message: error.details,
                    color: "red"
                })
            }).finally(() => {
                setSubmitting(false)
                notifications.hide("creating-quiz")
            })
        })}>
            <div className="flex flex-col mt-10 w-full">
                <div className="flex items-center w-full">
                    <h1 className="text-4xl font-bold mr-4">Title: </h1>
                    <Input placeholder="Main points of the talk" className="input input-bordered w-full text-3xl font-bold flex-1 py-5" size="lg" {...form.getInputProps("title")} />
                </div>
                <div className="mt-5 lg:flex">
                    <div className="form-control w-full flex justify-center lg:mr-10">
                        <label className="label">
                            <span className="label-text text-white">Quiz type</span>
                        </label>
                        <Select {...form.getInputProps("type")} className="select w-full">
                            <option value='talk'>Talk</option>
                            <option value="sponsor">Sponsor</option>
                            <option value="special">Special</option>
                            <option value="hidden">Hidden</option>
                        </Select>
                    </div>
                    <div className="form-control w-full flex justify-center">
                        <label className="label">
                            <span className="label-text text-white">Number of questions</span>
                        </label>
                        <Select className="select w-full" onChange={(e) => changeAnswareNumber(parseInt(e.target.value))} value={numOfQuizes}>
                            {Array.from({ length: 10 }, (_, i) => i+1).map((i) => <option value={i} key={i}>{i}</option>)}
                        </Select>
                    </div>
                    {false && <div className="form-control w-full flex justify-center">
                        <label className="label">
                            <span className="label-text text-white">Associated talk</span>
                        </label>
                        <Select {...form.getInputProps("talk")} className="select w-full">
                            {talks.map(talk => <option value={talk.value}>{talk.label}</option>)}
                        </Select>
                    </div>}
                </div>
                <div className="flex flex-col w-full justify-center items-center lg:flex-row">
                    {[getPage()].map((qNum) => <div className="flex flex-col mt-10 w-full justify-center items-center px-5" key={qNum} >
                        <div className="flex items-center w-full justify-center">
                            <h1 className="text-5xl font-bold mr-8 w-[50px]">{qNum+1}:</h1>
                            <div className="form-control w-full flex justify-center">
                                <label className="label">
                                    <span className="label-text text-white">Question</span>
                                </label>
                                <Input
                                    placeholder="Type here"
                                    className="input input-bordered w-full"
                                    name={`questions.${qNum}.question`}
                                    key={form.key(`questions.${qNum}.question`)}
                                    {...form.getInputProps(`questions.${qNum}.question`)}
                                />
                            </div>
                        </div>
                        {answers.map(opt => <div
                            key={form.key(`questions.${qNum}.${opt}.isCorrect`)}
                            className="flex items-center mt-5 w-full justify-center"
                        >
                            <Radio
                                name={`questions.${qNum}.options.isCorrect`}
                                key={form.key(`questions.${qNum}.options.${opt}.isCorrect`)}
                                checked={form.values.questions[qNum].options[opt].isCorrect}
                                onChange={(e) => {
                                    form.values.questions[qNum].options.forEach((o, i) => {
                                        form.setFieldValue(`questions.${qNum}.options.${i}.isCorrect`, false)
                                    })
                                    form.setFieldValue(`questions.${qNum}.options.${opt}.isCorrect`, e.target.checked)
                                }}
                            />
                            <Input
                                placeholder="Type here"
                                className="input input-bordered w-full ml-5"
                                name={`questions.${qNum}.options.${opt}.text`}
                                key={form.key(`questions.${qNum}.options.${opt}.text`)}
                                {...form.getInputProps(`questions.${qNum}.options.${opt}.text`)}
                            />
                        </div>)}
                        {form.values.type!="talk" && <div className="flex w-full justify-center items-center">
                            <span className="text-xl mr-3 flex items-center mt-3">Value: </span>
                            <Input
                                placeholder="Type here"
                                className="input input-bordered w-full mt-3 no-control"
                                name={`questions.${qNum}.value`}
                                key={form.key(`questions.${qNum}.value`)}
                                type="number"
                                min={0}
                                {...form.getInputProps(`questions.${qNum}.value`)}
                            />
                        </div>}
                    </div>)}
                </div>
            </div>
            <div className="my-10 flex md:gap-20 gap-8 flex-wrap justify-center items-center mb-20">
                <Input
                    type="button"
                    value="Back"
                    className={`btn btn-primary btn-wide ${selectedQuiz == 0 ? "opacity-40 btn-warning" : ""}`}
                    onClick={() => setSelectedQuiz(selectedQuiz - 1 < 0 ? 0 : selectedQuiz - 1)}
                    disabled={selectedQuiz == 0}
                />
                {
                    selectedQuiz == numOfQuizes - 1?
                    <Input
                        type="submit"
                        value={submitting ? "Loading" : "Add Quiz"}
                        className={`btn btn-primary btn-wide ${submitting || !form.isValid() ? "opacity-40 btn-warning" : ""}`}
                        onClick={checkErrors}
                        disabled={submitting}
                    />:
                    <Input
                        type="button"
                        value="Next"
                        className="btn btn-primary btn-wide"
                        onClick={() => setSelectedQuiz(getPage() + 1)}
                    />
                }
            </div>
        </form>
    </div>
}