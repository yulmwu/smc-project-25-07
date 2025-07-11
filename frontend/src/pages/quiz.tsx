import { useState } from 'react'
import { startQuiz, submitQuiz, getRankings, QuizQuestion, Ranking } from '../lib/api'

const QuizPage = () => {
    const [username, setUsername] = useState('')
    const [questions, setQuestions] = useState<QuizQuestion[]>([])
    const [answers, setAnswers] = useState<string[]>([])
    const [error, setError] = useState('')
    const [result, setResult] = useState<{ score: number; rank: number } | null>(null)
    const [rankings, setRankings] = useState<Ranking[]>([])
    const [loading, setLoading] = useState(false)

    const handleStartQuiz = async () => {
        if (!username.trim()) {
            setError('Please enter a username.')
            return
        }
        setLoading(true)
        setError('')
        try {
            const { quiz } = await startQuiz(username)
            setQuestions(quiz)
            setAnswers(new Array(quiz.length).fill(''))
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to start quiz.')
        }
        setLoading(false)
    }

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...answers]
        newAnswers[index] = value
        setAnswers(newAnswers)
    }

    const handleSubmitQuiz = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await submitQuiz(username, answers)
            setResult(res)
            const allRankings = await getRankings()
            setRankings(allRankings)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit quiz.')
        }
        setLoading(false)
    }

    if (result) {
        const top3 = rankings.slice(0, 3)
        const userRanking = rankings.find((r) => r.username === username)

        return (
            <div className='container mx-auto p-4'>
                <h1 className='text-2xl font-bold mb-4'>Quiz Result</h1>
                <p className='text-xl mb-2'>Your score: {result.score}</p>
                <p className='text-xl mb-4'>Your rank: {result.rank}</p>

                <h2 className='text-xl font-bold mt-8 mb-4'>Top 3 Rankings</h2>
                <ul className='list-disc pl-5'>
                    {top3.map((r) => (
                        <li key={r.rank}>
                            {r.rank}. {r.username} - {r.score}
                        </li>
                    ))}
                </ul>
                {userRanking && !top3.some((r) => r.username === username) && (
                    <p className='mt-4'>
                        Your position: {userRanking.rank}. {userRanking.username} - {userRanking.score}
                    </p>
                )}
            </div>
        )
    }

    if (questions.length > 0) {
        return (
            <div className='container mx-auto p-4'>
                <h1 className='text-2xl font-bold mb-4'>Quiz</h1>
                {questions.map((q, i) => (
                    <div key={q.id} className='mb-4'>
                        <p className='font-semibold'>
                            {i + 1}. {q.question}
                        </p>
                        <input
                            type='text'
                            value={answers[i]}
                            onChange={(e) => handleAnswerChange(i, e.target.value)}
                            className='border p-2 w-full mt-1'
                        />
                    </div>
                ))}
                <button
                    onClick={handleSubmitQuiz}
                    disabled={loading}
                    className='bg-blue-500 text-white px-4 py-2 rounded'
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
                {error && <p className='text-red-500 mt-4'>{error}</p>}
            </div>
        )
    }

    return (
        <div className='container mx-auto p-4 text-center'>
            <h1 className='text-2xl font-bold mb-4'>Start Quiz</h1>
            <input
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Enter your username'
                className='border p-2 w-full max-w-xs'
            />
            <button
                onClick={handleStartQuiz}
                disabled={loading}
                className='bg-blue-500 text-white px-4 py-2 rounded ml-2'
            >
                {loading ? 'Starting...' : 'Start Quiz'}
            </button>
            {error && <p className='text-red-500 mt-4'>{error}</p>}
        </div>
    )
}

export default QuizPage
