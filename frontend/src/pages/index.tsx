import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getPosts, Post, PaginatedPosts } from '@/lib/api'
import dayjs from 'dayjs'

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([])
    const [nextCursor, setNextCursor] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const [isNavigating, setIsNavigating] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<string>('전체')

    const categories = ['전체', '동물', '날씨/기후', '자연재해', '자유', '질문', '정보', '기타']

    const fetchPosts = useCallback(async (category: string, cursor?: number | null) => {
        setIsLoading(true)
        try {
            const data: PaginatedPosts = await getPosts(category, cursor)
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
        const urlCategory = router.query.category as string
        const shouldRefresh = router.query.refresh === 'true'
        const savedState = sessionStorage.getItem('homeState')

        if (shouldRefresh) {
            // If refresh is true, clear session storage and force refetch
            sessionStorage.removeItem('homeState')
            const categoryToFetch = urlCategory && categories.includes(urlCategory) ? urlCategory : '전체'
            setSelectedCategory(categoryToFetch)
            fetchPosts(categoryToFetch)

            // Remove refresh parameter from URL
            const newQuery = { ...router.query }
            delete newQuery.refresh
            router.replace(
                {
                    pathname: router.pathname,
                    query: newQuery,
                },
                undefined,
                { shallow: true }
            )
        } else if (savedState) {
            const { posts, nextCursor, scrollY, selectedCategory: savedCategory } = JSON.parse(savedState)
            setPosts(posts)
            setNextCursor(nextCursor)
            setSelectedCategory(savedCategory ?? '전체')
            setTimeout(() => window.scrollTo(0, scrollY), 0)
            sessionStorage.removeItem('homeState')
        } else if (urlCategory && categories.includes(urlCategory)) {
            // If category in URL, but not refresh, set category and fetch
            setSelectedCategory(urlCategory)
            fetchPosts(urlCategory)
        } else {
            // If no category in URL, check session storage
            fetchPosts(selectedCategory)
        }
    }, [fetchPosts, router.query.category, router.query.refresh]) // Add router.query.refresh to dependencies

    useEffect(() => {
        const handleRouteChangeStart = (url: string) => {
            if (router.pathname === '/' && url.startsWith('/posts/')) {
                const homeState = {
                    posts,
                    nextCursor,
                    scrollY: window.scrollY,
                    selectedCategory,
                }
                sessionStorage.setItem('homeState', JSON.stringify(homeState))
            }
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
    }, [router.events, router.pathname, posts, nextCursor, selectedCategory])

    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 100 ||
            isLoading
        ) {
            return
        }
        if (nextCursor) {
            fetchPosts(selectedCategory, nextCursor)
        }
    }, [isLoading, nextCursor, fetchPosts, selectedCategory])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [handleScroll])

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category)
        setPosts([])
        setNextCursor(null)
        fetchPosts(category)

        // Update URL with category parameter
        const newQuery = { ...router.query }
        newQuery.category = category
        router.push(
            {
                pathname: router.pathname,
                query: newQuery,
            },
            undefined,
            { shallow: true }
        )
    }

    return (
        <>
            <title>조선인사이드 - 홈</title>
            <div className='flex justify-between items-center mb-5'>
                <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-center'>{selectedCategory}</h1>
                <Link
                    href={`/posts/new?category=${encodeURIComponent(selectedCategory)}`}
                    className='inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-1 px-2 sm:py-2 sm:px-4 rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 transition mr-2 text-sm sm:text-base'
                >
                    새 글 작성
                </Link>
            </div>

            <div className='flex space-x-2 mb-2 overflow-x-auto pb-2 whitespace-nowrap'>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`px-4 py-2 rounded-full text-sm sm:text-base transition-colors duration-200 ease-in-out cursor-pointer
                            ${
                                selectedCategory === category
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
            <div className='mt-3 space-y-4'>
                {posts.map((post) => (
                    <article
                        key={post.id}
                        className='bg-white pt-4 pb-4 pl-7 pr-7 rounded-lg shadow hover:shadow-md transition cursor-pointer'
                    >
                        <Link href={`/posts/${post.id}`} className='flex flex-col w-full h-full'>
                            <div className='flex flex-col md:flex-row-reverse items-start md:items-center'>
                                {post.thumbnailUrl && (
                                    <div className='w-full md:w-1/4 mb-5 md:mb-0 md:ml-4 flex-shrink-0'>
                                        <img
                                            src={post.thumbnailUrl}
                                            alt='썸네일'
                                            className='w-full h-32 md:h-28 object-cover rounded-lg'
                                        />
                                    </div>
                                )}
                                <div className='flex-1'>
                                    <p className='text-blue-500 text-sm mb-1.5'>
                                        {post.category ? `${post.category}` : '분류 없음'}
                                    </p>
                                    <h3 className='text-lg font-semibold mb-1.5'>
                                        {post.title}
                                        {post.commentCount && post.commentCount > 0 ? (
                                            <span className='text-gray-400 ml-2'>[{post.commentCount}]</span>
                                        ) : (
                                            ''
                                        )}
                                    </h3>
                                    {post.description && (
                                        <p className='text-gray-600 mt-1 line-clamp-2'>{post.description}</p>
                                    )}
                                    {(post.tags ?? []).length > 0 && (
                                        <div className='mt-6 flex flex-wrap gap-2'>
                                            {post.tags!.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className='inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-300 transition duration-200'
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 하단 구분선 */}
                            <hr className='border-gray-200 my-3' />

                            {/* 작성자 / 날짜 / 조회수 */}
                            <div className='text-sm text-gray-400 flex justify-between items-center mt-auto'>
                                <p>
                                    작성자: <span className='font-medium text-gray-700'>{post.author}</span>
                                </p>
                                <p>
                                    <span>{dayjs(post.createdAt).format('YYYY-MM-DD HH:mm')}</span>
                                    <span className='ml-3 sm:inline hidden'>조회수: {post.views ?? 0}</span>
                                </p>
                            </div>
                            <div className='text-sm text-gray-400 flex justify-end items-center mt-auto sm:hidden'>
                                <p>조회수: {post.views}</p>
                            </div>
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
