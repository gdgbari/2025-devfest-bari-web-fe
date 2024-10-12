import { Card } from 'react-daisyui';
import type { Quiz } from '../utils';
import { FaChevronRight } from 'react-icons/fa';
import { useAppRouter } from '../utils/store';
import { FaLock } from "react-icons/fa";

export function QuizCard({ quiz }: { quiz: Quiz }) {

    const { navigateToQuiz } = useAppRouter()

    return <Card role='button' className='border-2 rounded-lg border-white p-4 cursor-pointer' onClick={() => navigateToQuiz(quiz.quizId)}>
        <div className="flex">
            <div className="flex-1 flex flex-col items-start">
                <p className='flex gap-2 items-center justify-center'>{quiz.maxScore} points ({quiz.type} quiz) {!quiz.isOpen && <FaLock size={13} color='red' />}</p>
                <h2 className='text-3xl font-semibold'> {quiz.title}</h2>
                <p> {quiz.questionList.length} questions</p>
                <div className='flex flex-1' />
                <div className='flex justify-between w-full'>
                    <p> time: {quiz.timerDuration/1000} s</p>
                    <small>{quiz.quizId}</small>
                </div>
                
            </div>
            <div className='min-h-32 flex justify-center items-center'>
                <FaChevronRight size={25} />
            </div>
        </div>
    </Card>
}