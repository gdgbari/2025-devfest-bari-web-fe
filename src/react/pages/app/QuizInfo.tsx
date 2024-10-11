import { Button, Input, Radio } from "react-daisyui"
import { IoMdArrowRoundBack } from "react-icons/io"
import { TitleBar } from "../../components/TitleBar"
import { useAppRouter } from "../../utils/store"
import { useQuiz } from "../../utils/query";
import { type QuizDetails } from "../../utils/index";
import { BsQrCodeScan } from "react-icons/bs";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from '@mantine/core';
import { useRef, type MutableRefObject } from "react";
import { QRCode } from "react-qrcode-logo"



export function QuizInfo() {
    const [opened, { open, close }] = useDisclosure(false);
    const { currentPage, navigate } = useAppRouter();
    const quizId = currentPage.split('/')[1];
    const quiz = useQuiz({ quizId });
    const qrCodeRef = useRef<QRCode>();
    if (quiz.data) {
        console.log(quiz.data)
    }

    return <>
        <Modal opened={opened} onClose={close} withCloseButton={true} size={'xl'} title="Qr code">
            <div className="flex flex-col items-center">
                <QRCode
                    size={400}
                    value={`quiz:${quizId}`} 
                    ref={qrCodeRef as MutableRefObject<QRCode>}
                />
                <div className="h-8"></div>
                <Button onClick={() => qrCodeRef.current?.download("png", quizId)}>Download Qr</Button>
            </div>
        </Modal>

        <div className="flex-col h-full gap-4">
            <TitleBar title="Quiz Info" actions={[
                <Button className="btn-circle mr-4" onClick={() => navigate("app")} >
                    <IoMdArrowRoundBack size={32} />
                </Button>,
                ...quiz.isSuccess ? [
                    <Button className="btn-circle " onClick={open} >
                        <BsQrCodeScan size={26} />
                    </Button>
                ] : []
            ]}
            />
            <div className="h-10"></div>
            {quiz.isLoading && <h1>Loading quiz {quizId}</h1>}
            {quiz.isSuccess && <QuizDetails quiz={quiz.data} />}
            {quiz.isError && quiz.error && <div className="flex-1 flex flex-col justify-center items-center">
                <p className="mb-12 text-5xl font-bold">Ops!! {quiz.error.message}</p>
                <img src="https://media1.tenor.com/m/KWCVIqd2HmYAAAAd/boris-proda.gif" />
            </div>}
        </div>
    </>

}

const QuizDetails = ({ quiz }: { quiz: QuizDetails }) => {
    return <div className="flex flex-col items-stretch text-start">
        <h2 className="text-4xl font-bold mr-4">Title: {quiz.title}</h2>
        <div className="flex items-center mt-4">
            <h2 className="text-xl font-bold mr-4 w-40">Quiz type: </h2>
            <Input
                className="input input-bordered w-full  no-control text-white"
                value={quiz.type}
                readOnly={true}
            />
        </div>
        <div className="mt-4">
            <h2 className="text-3xl font-semibold">Questions: </h2>

            {quiz.questionList.map((q, i) => (
                <div key={q.questionId} className="mt-4">
                    <h3 className="text-2xl font-medium">{i + 1}. {q.text} </h3>

                    {q.answerList.map((a) => (
                        <div key={a.id} className="flex mt-4 gap-4">
                            <Radio readOnly={true} checked={q.correctAnswer == a.id} />
                            <p className="text-xl">{a.text}</p></div>
                    ))}
                </div>
            ))}
        </div>
    </div>
}