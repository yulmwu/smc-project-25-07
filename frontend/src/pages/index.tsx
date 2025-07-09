import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getPosts, Post, PaginatedPosts } from '@/lib/api'

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([])
    const [nextCursor, setNextCursor] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const [isNavigating, setIsNavigating] = useState(false)

    const fetchPosts = useCallback(async (cursor?: number) => {
        setIsLoading(true)
        try {
            const data: PaginatedPosts = await getPosts(cursor)
            setPosts((prevPosts) => {
                const newPosts = data.items.filter(
                    (newItem) => !prevPosts.some((existingItem) => existingItem.id === newItem.id)
                )
                return cursor ? [...prevPosts, ...newPosts] : data.items
            })
            setNextCursor(data.nextCursor)
        } catch (error) {
            console.error('Failed to fetch posts:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        const savedState = sessionStorage.getItem('homeState')
        if (savedState) {
            const { posts, nextCursor, scrollY } = JSON.parse(savedState)
            setPosts(posts)
            setNextCursor(nextCursor)
            setTimeout(() => window.scrollTo(0, scrollY), 0)
            sessionStorage.removeItem('homeState')
        } else {
            fetchPosts()
        }
    }, [fetchPosts])

    useEffect(() => {
        const handleRouteChangeStart = () => {
            const homeState = {
                posts,
                nextCursor,
                scrollY: window.scrollY,
            }
            sessionStorage.setItem('homeState', JSON.stringify(homeState))
            setIsNavigating(true)
        }

        const handleRouteChangeComplete = () => {
            setIsNavigating(false)
        }

        router.events.on('routeChangeStart', handleRouteChangeStart)
        router.events.on('routeChangeComplete', handleRouteChangeComplete)

        return () => {
            router.events.off('routeChangeStart', handleRouteChangeStart)
            router.events.off('routeChangeComplete', handleRouteChangeComplete)
        }
    }, [router.events, posts, nextCursor])

    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 100 ||
            isLoading
        ) {
            return
        }
        if (nextCursor) {
            fetchPosts(nextCursor)
        }
    }, [isLoading, nextCursor, fetchPosts])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [handleScroll])

    return (
        <>
            <h1 className='text-4xl font-extrabold text-gray-900 mb-8'>익명 게시판</h1>
            <Link
                href='/posts/new'
                className='inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 transition'
            >
                새 글 작성
            </Link>
            <div className='mt-8 space-y-4'>
                {posts.map((post) => (
                    <article
                        key={post.id}
                        className='bg-white p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer'
                    >
                        <Link href={`/posts/${post.id}`}>
                            <h3 className='text-lg font-semibold mb-2'>
                                {post.title} {post.commentCount && `[${post.commentCount}]`}
                            </h3>
                            <p className='text-sm text-gray-700'>
                                작성자: <span className='font-medium text-gray-700'>{post.author}</span>
                            </p>
                        </Link>
                    </article>
                ))}
            </div>
            {isLoading && (
                <div className='flex justify-center mt-8'>
                    <p className='text-gray-500'>로딩 중...</p>
                </div>
            )}
            {isNavigating && (
                <div className='fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50'>
                    <p className='text-gray-700 text-lg font-semibold'>게시글 로딩 중...</p>
                </div>
            )}
        </>
    )
}