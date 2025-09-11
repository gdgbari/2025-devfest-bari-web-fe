import { Button, Checkbox, Input, Radio } from "react-daisyui"
import { IoMdArrowRoundBack } from "react-icons/io"
import { TitleBar } from "../../components/TitleBar"
import { useAppRouter } from "../../utils/store"
import { useQuizzes, useUserProfileById } from "../../utils/query";
import { BsQrCodeScan } from "react-icons/bs";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from '@mantine/core';
import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { QRCode } from "react-qrcode-logo"
import { secondDurationToString, toggleQuiz, type Quiz } from "../../utils";
import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";

export function QuizInfo() {
    const [opened, { open, close }] = useDisclosure(false);
    const { navigate, quizId } = useAppRouter();
    const quizzes = useQuizzes();
    const quiz = quizzes.data?.find(q => q.quizId == quizId)

    const qrCodeRef = useRef<QRCode>();

    useEffect(() => {
        if (quizId == null){
            navigate("app")
        }
    }, [quizId])

    return <>
        <Modal opened={opened} onClose={close} withCloseButton={true} size="xl" title="Qr code" centered>
            <div className="flex flex-col items-center justify-center h-full">
                <QRCode
                    size={400}
                    value={`quiz:${quizId}`}
                    logoImage="/assets/images/icons/icon-512x512.png"
                    ref={qrCodeRef as MutableRefObject<QRCode>}
                    qrStyle="fluid"
                    removeQrCodeBehindLogo
                    logoPaddingStyle="circle"
                    logoWidth={100}
                    eyeRadius={20}
                />
                <Button className="mt-8" onClick={() => qrCodeRef.current?.download("png", quizId??"")}>Download Qr</Button>
            </div>
        </Modal>

        <div className="flex-col h-full gap-4">
            <TitleBar title="Quiz Info" actions={[
                <Button className="btn-circle mr-4" onClick={() => navigate("app")} >
                    <IoMdArrowRoundBack size={32} />
                </Button>,
                ...quiz != null ? [
                    <Button className="btn-circle " onClick={open} >
                        <BsQrCodeScan size={26} />
                    </Button>
                ] : []
            ]}
            />
            <div className="h-10"></div>
            {quizzes.isLoading && <h1>Loading quiz {quizId}</h1>}
            {quiz && <QuizDetails quiz={quiz} />}
            {quizzes.isError && quizzes.error && <div className="flex-1 flex flex-col justify-center items-center">
                <p className="mb-12 text-5xl font-bold">Ops!! {quizzes.error.message}</p>
                <img src="https://media1.tenor.com/m/KWCVIqd2HmYAAAAd/boris-proda.gif" />
            </div>}
        </div>
    </>

}

const QuizDetails = ({ quiz }: { quiz: Quiz }) => {

    const createdBy = useUserProfileById(quiz.creatorUid)
    const [showSecrets, setShowSecrets] = useState(false)
    const quizzes = useQuizzes(); //Useful only for checking cache state
    const [quizToggled, setQuizToggled] = useState(false)
    const queryClient = useQueryClient()

    useEffect(() => {
        if (quizToggled && !quizzes.isFetching) {
            setQuizToggled(false)
        }
    }, [quizzes.isFetching])

    return <div className="flex flex-col items-stretch text-start">
        <h2 className="text-4xl font-bold mr-4f flex items-center gap-4">Title: {quiz.title}
            <Button className="btn-circle btn-sm bg-[#444] border-[#444] w-10 h-10 hover:border-[#333] hover:bg-[#333]" onClick={() => {
                setQuizToggled(true)
                toggleQuiz(quiz.quizId).then(() => {
                    setQuizToggled(false)
                    quiz.isOpen = !quiz.isOpen
                    queryClient.refetchQueries({ queryKey: ["quizzes"]})
                })
            }} loading={quizToggled} disabled={quizToggled}>
                {quizToggled? null: quiz.isOpen ? <FaLockOpen size={20} color="lime" /> : <FaLock size={20} color='red' />}
            </Button>
            
        </h2>
        <div className="flex items-center mt-4">
            <h2 className="text-xl font-bold mr-4 w-40">Quiz type: </h2>
            <Input
                className="input input-bordered w-full  no-control text-white"
                value={quiz.type}
                readOnly={true}
            />
        </div>
        <div className="flex items-center mt-4">
            <h2 className="text-xl font-bold mr-4 w-40">Max value: </h2>
            <Input
                className="input input-bordered w-full  no-control text-white"
                value={quiz.maxScore}
                readOnly={true}
            />
        </div>
        <div className="flex items-center mt-4">
            <h2 className="text-xl font-bold mr-4 w-40">Created by: </h2>
            <Input
                className="input input-bordered w-full  no-control text-white"
                value={createdBy.isLoading?`${quiz.creatorUid} (Loading data...)`:`${createdBy.data?.name} ${createdBy.data?.surname} (${createdBy.data?.nickname})`}
                readOnly={true}
            />
        </div>
        <div className="flex items-center mt-4">
            <h2 className="text-xl font-bold mr-4 w-40">Timer Duration: </h2>
            <Input
                className="input input-bordered w-full  no-control text-white"
                value={secondDurationToString(quiz.timerDuration/1000)}
                readOnly={true}
            />
        </div>

        <div className="flex items-center justify-center mt-5">
            <b>Show secrets: </b>
            <Checkbox className="ml-3 checkbox-white" size="md" onChange={(e)=>setShowSecrets(e.target.checked)} checked={showSecrets}/>
        </div>

        { showSecrets && <div className="mt-4">
            {quiz.questionList.length == 0 && <h2 className="text-3xl font-semibold">No questions</h2>}
            {quiz.questionList.length > 0 && <h2 className="text-3xl font-semibold">Questions: </h2>}
            {quiz.questionList.map((q, i) => (
                <div key={q.questionId} className="mt-4">
                    <h3 className="text-2xl font-medium">{i + 1}. {q.text} ({q.value??"?"} points)</h3>

                    {q.answerList.sort(
                        (a,b) =>
                            // Correct answer first
                            a.id == q.correctAnswer?-1:b.id == q.correctAnswer?1:
                            // Then sort by id (avoids shuffling on refresh)
                            a.id.localeCompare(b.id)
                    ).map((a) => (
                        <div key={a.id} className="flex mt-4 gap-4">
                            <Radio readOnly={true} checked={q.correctAnswer == a.id} />
                            <p className="text-xl">{a.text}</p></div>
                    ))}
                </div>
            ))}
        </div> }
        <div className="mt-10" />
    </div>
}