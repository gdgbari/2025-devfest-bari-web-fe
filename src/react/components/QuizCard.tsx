import { Card } from 'react-daisyui';
import type { Quiz } from '../utils';
import { FaChevronRight } from 'react-icons/fa';
import { useAppRouter } from '../utils/store';

export function QuizCard({ quiz }: { quiz: Quiz }) {

    const { navigate } = useAppRouter()

    return <Card role='button' className='border-2 rounded-lg border-white p-4 cursor-pointer' onClick={() => navigate(`quiz/${quiz.quizId}`)}>
        <div className="flex">
            <div className="flex-1 flex flex-col items-start">
                <p > {quiz.type} - {quiz.quizId}</p>
                <h2 className='text-3xl font-semibold'> {quiz.title}</h2>
            </div>
            <div className='min-h-32 flex justify-center items-center'>
                <FaChevronRight size={25} />
            </div>
        </div>
    </Card>
}