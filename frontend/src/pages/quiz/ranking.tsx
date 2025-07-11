import { useState, useEffect } from 'react'
import { getRankings, Ranking } from '../../lib/api'

const RankingPage = () => {
    const [rankings, setRankings] = useState<Ranking[]>([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const data = await getRankings()
                setRankings(data)
            } catch (err: any) {
                setError(err.response?.data?.message || '랭킹을 불러오는데 실패했습니다.')
            }
            setLoading(false)
        }

        fetchRankings()
    }, [])

    if (loading) {
        return <div className='container mx-auto p-4 text-center'>로딩 중...</div>
    }

    if (error) {
        return <div className='container mx-auto p-4 text-red-500 text-center'>{error}</div>
    }

    return (
        <>
            <title>조선인사이드 - 퀴즈 랭킹</title>
            <div className='container mx-auto p-4'>
                <h1 className='text-3xl font-bold mb-6 text-center text-gray-800'>퀴즈 랭킹</h1>
                <div className='bg-white rounded-lg shadow-lg p-4'>
                    <table className='w-full border-collapse'>
                        <thead>
                            <tr className='bg-gray-200'>
                                <th className='p-3 text-left text-sm font-semibold text-gray-600'>순위</th>
                                <th className='p-3 text-left text-sm font-semibold text-gray-600'>이름</th>
                                <th className='p-3 text-left text-sm font-semibold text-gray-600'>점수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rankings.map((r) => (
                                <tr key={r.rank} className='border-b border-gray-200 hover:bg-gray-50'>
                                    <td className='p-3 text-center font-bold text-indigo-600'>{r.rank}</td>
                                    <td className='p-3 text-gray-800'>{r.username}</td>
                                    <td className='p-3 text-center font-semibold'>{r.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default RankingPage
