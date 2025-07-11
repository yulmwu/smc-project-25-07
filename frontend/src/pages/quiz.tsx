import { useState } from 'react'
import { startQuiz, submitQuiz, getRankings, QuizQuestion, Ranking } from '../lib/api'
import Link from 'next/link'
import { shuffleArray } from '../utils/shuffle'
import { useRouter } from 'next/router'
import Head from 'next/head'

const QuizPage = () => {
    const [username, setUsername] = useState('')
    const [questions, setQuestions] = useState<QuizQuestion[]>([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<string[]>([])
    const [error, setError] = useState('')
    const [result, setResult] = useState<{ score: number; rank: number } | null>(null)
    const [rankings, setRankings] = useState<Ranking[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleStartQuiz = async () => {
        if (!username.trim()) {
            setError('유저 이름을 입력해주세요.')
            return
        }
        setLoading(true)
        setError('')
        try {
            const { quiz } = await startQuiz(username)
            setQuestions(quiz)
            setAnswers(new Array(quiz.length).fill(''))
            setCurrentQuestionIndex(0)
        } catch (err: any) {
            if ((err.response?.data.message ?? '').includes('already')) {
                // 임시 조치
                setError('이미 퀴즈를 시작한 유저 이름입니다. 다른 이름을 사용해주세요.')
            } else {
                setError(err.response?.data?.message ?? '퀴즈를 시작하는데 실패했습니다.')
            }
        }
        setLoading(false)
    }

    const handleAnswerChange = (value: string) => {
        const newAnswers = [...answers]
        newAnswers[currentQuestionIndex] = value
        setAnswers(newAnswers)
    }

    const handleNextQuestion = () => {
        if (answers[currentQuestionIndex] === '') {
            setError('정답을 선택해주세요.')
            return
        }

        setError('')

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
        }
    }

    const handleSubmitQuiz = async () => {
        if (answers[currentQuestionIndex] === '') {
            setError('마지막 질문입니다. 정답을 선택해주세요.')
            return
        }

        setLoading(true)
        setError('')
        try {
            const res = await submitQuiz(username, answers)
            setResult(res)
            const allRankings = await getRankings()
            setRankings(allRankings)
        } catch (err: any) {
            setError(err.response?.data?.message || '퀴즈 제출에 실패했습니다.')
        }
        setLoading(false)
    }

    if (result) {
        const top3 = rankings.slice(0, 3)
        const userRanking = rankings.find((r) => r.username === username)

        return (
            <>
                <Head>
                    <title>조선인사이드 - 퀴즈</title>
                </Head>
                <div className='container mx-auto p-4 max-w-2xl bg-white rounded-lg shadow-lg'>
                    <h1 className='text-3xl font-bold mb-4 text-center text-gray-800'>퀴즈 결과</h1>
                    <h2 className='text-2xl font-bold mb-4 text-center text-gray-700'>
                        점수: {result.score} ({result.rank}위)
                    </h2>

                    <ul className='list-none p-0 mt-4'>
                        {top3.map((r) => (
                            <li
                                key={r.rank}
                                className={`flex justify-between items-center ${
                                    r.username === username ? 'bg-green-200' : 'bg-gray-100'
                                } p-3 rounded-lg mb-2`}
                            >
                                <span className='font-semibold text-lg'>{r.rank}등</span>
                                <span className='text-gray-800'>{r.username}</span>
                                <span className='font-bold text-indigo-600'>{r.score}점</span>
                            </li>
                        ))}
                        {userRanking && !top3.some((r) => r.username === username) && (
                            <li className='flex justify-between items-center bg-green-200 p-3 rounded-lg mb-2'>
                                <span className='font-semibold text-lg'>{userRanking.rank}등</span>
                                <span className='text-gray-800'>{userRanking.username}</span>
                                <span className='font-bold text-indigo-600'>{userRanking.score}점</span>
                            </li>
                        )}
                    </ul>
                </div>
                <div className='text-center mt-6'>
                    <Link href='/quiz/ranking'>
                        <button className='bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition mr-4 cursor-pointer'>
                            퀴즈 랭킹 보기
                        </button>
                    </Link>
                    <button
                        className='bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition cursor-pointer'
                        onClick={() => router.reload()}
                    >
                        다시 도전하기
                    </button>
                </div>
            </>
        )
    }

    if (questions.length > 0) {
        const currentQuestion = questions[currentQuestionIndex]
        return (
            <>
                <Head>
                    <title>조선인사이드 - 퀴즈</title>
                </Head>
                <div className='container mx-auto p-4 pl-10 pr-10 bg-white rounded-lg shadow-lg'>
                    <h1 className='text-3xl font-bold mb-4 text-center text-gray-800'>퀴즈</h1>
                    <div className='mb-6 flex flex-col items-center'>
                        <p className='font-semibold text-xl text-center'>
                            질문 {currentQuestionIndex + 1}/{questions.length}
                        </p>
                        <p className='text-lg text-center mt-2'>{currentQuestion.question}</p>
                        <select
                            value={answers[currentQuestionIndex]}
                            onChange={(e) => handleAnswerChange(e.target.value)}
                            className='border p-3 w-full mt-4 rounded-lg focus:ring-2 focus:ring-indigo-500 transition max-w-md cursor-pointer'
                        >
                            <option value=''>정답을 선택하세요</option>
                            {shuffleArray(currentQuestion.options).map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='flex justify-center items-center mb-6'>
                        {currentQuestionIndex < questions.length - 1 ? (
                            <button
                                onClick={handleNextQuestion}
                                className='bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition cursor-pointer'
                            >
                                다음 문제
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmitQuiz}
                                disabled={loading}
                                className='bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition'
                            >
                                {loading ? '제출 중...' : '결과 보기'}
                            </button>
                        )}
                    </div>
                    {error && <p className='text-red-500 mt-4 text-center'>{error}</p>}
                </div>
            </>
        )
    }

    return (
        <>
            <Head>
                <title>조선인사이드 - 퀴즈</title>
            </Head>
            <div className='container mx-auto p-4 text-center bg-white rounded-lg shadow-lg'>
                <h1 className='text-3xl font-bold mb-6 mt-3 text-gray-800'>퀴즈 시작하기</h1>
                <p className='text-lg text-gray-600 mb-4'>
                    {/* 역사 알아가기 동물 날씨/기후 자연재해 */}
                    조선인사이드의{' '}
                    <a href='/?category=역사+알아가기' className='text-indigo-600 hover:underline'>
                        역사 알아가기
                    </a>
                    ,{' '}
                    <a href='/?category=동물' className='text-indigo-600 hover:underline'>
                        동물
                    </a>
                    ,{' '}
                    <a href='/?category=날씨%2F기후' className='text-indigo-600 hover:underline'>
                        날씨/기후
                    </a>
                    ,{' '}
                    <a href='/?category=자연재해' className='text-indigo-600 hover:underline'>
                        자연재해
                    </a>{' '}
                    카테고리를 참고하여 퀴즈를 풀어보세요.
                </p>
                <p className='text-gray-500 mb-6'>
                    문제를 푸는 도중 페이지를 벗어나거나 새로고침 시 저장되지 않으며 해당 이름으로 다시 시작할 수
                    없습니다.
                </p>
                <div className='max-w-md mx-auto mb-5 mt-10'>
                    <input
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='이름을 입력하세요'
                        className='border p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-500 transition mb-4'
                    />
                    <button
                        onClick={handleStartQuiz}
                        disabled={loading}
                        className='bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700 transition w-full cursor-pointer'
                    >
                        {loading ? '시작 중...' : '퀴즈 시작'}
                    </button>
                    <Link href='/quiz/ranking'>
                        <button className='mt-10 w-full bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg shadow hover:bg-gray-300 transition cursor-pointer'>
                            퀴즈 랭킹 보기
                        </button>
                    </Link>
                </div>
                {error && <p className='text-red-500 mt-4'>{error}</p>}
            </div>
        </>
    )
}

export default QuizPage
