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
    const [selectedCategory, setSelectedCategory] = useState<string>('전체')

    const categories = ['전체', '역사 알아가기', '자유', '질문', '정보']

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
        } else if (urlCategory && categories.includes(urlCategory)) {
            // If category in URL, but not refresh, set category and fetch
            setSelectedCategory(urlCategory)
            fetchPosts(urlCategory)
        } else {
            // If no category in URL, check session storage
            const savedState = sessionStorage.getItem('homeState')
            if (savedState) {
                const { posts, nextCursor, scrollY, selectedCategory: savedCategory } = JSON.parse(savedState)
                setPosts(posts)
                setNextCursor(nextCursor)
                setSelectedCategory(savedCategory || '전체')
                setTimeout(() => window.scrollTo(0, scrollY), 0)
                sessionStorage.removeItem('homeState')
            } else {
                fetchPosts(selectedCategory)
            }
        }
    }, [fetchPosts, router.query.category, router.query.refresh]) // Add router.query.refresh to dependencies

    useEffect(() => {
        const handleRouteChangeStart = () => {
            const homeState = {
                posts,
                nextCursor,
                scrollY: window.scrollY,
                selectedCategory,
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
    }, [router.events, posts, nextCursor, selectedCategory])

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
        if (category === '전체') {
            delete newQuery.category
        } else {
            newQuery.category = category
        }
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
            {/* <title>조선인사이드</title>  */}
            <div className='flex justify-between items-center mb-8'>
                <h1 className='text-4xl font-extrabold text-gray-900'>
                    {selectedCategory === '전체' ? '조선인사이드: 전체 글' : `${selectedCategory}`}
                </h1>
                <Link
                    href={
                        selectedCategory === '전체'
                            ? '/posts/new'
                            : `/posts/new?category=${encodeURIComponent(selectedCategory)}`
                    }
                    className='inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 transition'
                >
                    새 글 작성
                </Link>
            </div>

            <div className='flex space-x-2 mb-4 overflow-x-auto pb-2'>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ease-in-out
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

            <div className='mt-8 space-y-4'>
                {posts.map((post) => (
                    <article
                        key={post.id}
                        className='bg-white p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer'
                    >
                        <Link href={`/posts/${post.id}`}>
                            <h3 className='text-lg font-semibold mb-2'>
                                <p className='text-blue-500 text-sm mb-1'>
                                    {post.category ? `[${post.category}]` : '[분류 없음]'}
                                </p>
                                {post.title}
                                <span className='text-gray-500 ml-2'>
                                    {post.commentCount && `[${post.commentCount}]`}
                                </span>
                            </h3>
                            <p className='text-sm text-gray-700'>
                                작성자: <span className='font-medium text-gray-700'>{post.author}</span>
                                <span className='text-gray-500 ml-2'>
                                    ({new Date(post.createdAt!).toLocaleDateString()})
                                </span>
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
