import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getPosts, Post, PaginatedPosts } from '@/lib/api'

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([])
    const [nextCursor, setNextCursor] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const fetchPosts = async (cursor?: number) => {
        setIsLoading(true)
        try {
            const data: PaginatedPosts = await getPosts(cursor)
            console.log('Fetched posts:', data)
            setPosts(prevPosts => (cursor ? [...prevPosts, ...data.items] : data.items))
            setNextCursor(data.nextCursor)
        } catch (error) {
            console.error('Failed to fetch posts:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    return (
        <div className='max-w-3xl mx-auto p-6'>
            <h1 className='text-4xl font-extrabold text-gray-900 mb-8'>익명 게시판</h1>
            <Link
                href='/posts/new'
                className='inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 transition'
            >
                새 글 작성
            </Link>
            <ul className='mt-8 space-y-6'>
                {posts.map((post) => (
                    <li
                        key={post.id}
                        className='border rounded-xl shadow-sm hover:shadow-md transition p-6 bg-white cursor-pointer'
                    >
                        <Link href={`/posts/${post.id}`}>
                            <h2 className='text-2xl font-semibold text-gray-800 mb-1 truncate'>{post.title}</h2>
                            <p className='text-gray-500 text-sm'>
                                작성자: <span className='font-medium text-gray-700'>{post.author}</span>
                            </p>
                        </Link>
                    </li>
                ))}
            </ul>
            {nextCursor && (
                <div className='flex justify-center mt-8'>
                    <button
                        onClick={() => fetchPosts(nextCursor)}
                        disabled={isLoading}
                        className='bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:from-green-500 hover:to-blue-600 transition disabled:opacity-50'
                    >
                        {isLoading ? '로딩 중...' : '더 보기'}
                    </button>
                </div>
            )}
        </div>
    )
}