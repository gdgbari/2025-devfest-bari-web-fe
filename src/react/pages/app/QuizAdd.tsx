import { Button, Input, Radio, Select } from "react-daisyui"
import { useAppRouter } from "../../utils/store"
import { useForm } from "@mantine/form";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import { IoMdArrowRoundBack } from "react-icons/io";

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

    const form = useForm({
        initialValues: {
            title: "",
            type: "talk",
            talk: "",
            questions: [0,1,2,3].map((qNum) => ({
                question: "",
                options: [
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false }
                ]
            }))
        },
        validate: {
            title: (value) => value.length > 0 ? undefined : "Title is required",
            talk: (value) => value.length > 0 ? undefined : "Talk is required",
            type: (value) => value == "talk" || value == "sponsor"? undefined : "Invalid type",
            questions: (value) => {
                let error: undefined|string = undefined
                value.forEach((q, i) => {
                    if (q.question.length == 0){
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
            talk: "Talk is required",
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
        <div className="flex align-middle justify-center">
            <h1 className="text-5xl font-bold">Add Quiz</h1>
            <div className="flex-1" />
            <Button className="btn-circle" onClick={()=>navigate("app")} >
                <IoMdArrowRoundBack size={32} />
            </Button>
        </div>
        <form onSubmit={form.onSubmit((data)=>{
            setSubmitting(true)
            console.log(data)
            setSubmitting(false)
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
                            <option value='talk'>Talk Quiz</option>
                            <option value="sponsor">Sponsor Quiz</option>
                        </Select>
                    </div>
                    {form.values.type == "talk" && <div className="form-control w-full flex justify-center">
                        <label className="label">
                            <span className="label-text text-white">Associated talk</span>
                        </label>
                        <Select {...form.getInputProps("talk")} className="select w-full">
                            {talks.map(talk => <option value={talk.value}>{talk.label}</option>)}
                        </Select>
                    </div>}
                </div>
                <div className="flex flex-col w-full lg:flex-wrap justify-center items-center lg:flex-row">
                    {[0,1,2,3].map((qNum) => <div className="flex flex-col mt-10 w-full justify-center items-center px-5" style={{ flexBasis: "50%" }}>
                        <div className="flex items-center w-full justify-center">
                            <h1 className="text-5xl font-bold mr-8">{qNum+1}:</h1>
                            <div className="form-control w-full flex justify-center max-w-lg">
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
                        {[0,1,2,3].map(opt => <div
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
                                className="input input-bordered w-full max-w-xs ml-5"
                                name={`questions.${qNum}.options.${opt}.text`}
                                key={form.key(`questions.${qNum}.options.${opt}.text`)}
                                {...form.getInputProps(`questions.${qNum}.options.${opt}.text`)}
                            />
                        </div>)}
                    </div>)}
                </div>
            </div>
            <Input
                type="submit"
                value={submitting ? "Loading" : "Add Quiz"}
                className={`btn btn-primary btn-wide ${submitting || !form.isValid() ? "opacity-40 btn-warning" : ""} my-20`}
                onClick={checkErrors}
                disabled={submitting}
            />
        </form>
    </div>
}