import { BASE_URL, getPosts, Post } from '@/lib/api'
import './globals.css'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { FaBook, FaComments, FaGithub, FaInfoCircle, FaList, FaQuestionCircle } from 'react-icons/fa'
import { FaDiagramProject } from 'react-icons/fa6'

export const SidebarContent = () => (
    <div>
        <h2 className='text-lg font-semibold mb-3'>카테고리</h2>
        <ul className='space-y-2 text-sm'>
            <li>
                <a href='/?category=전체' className='hover:underline'>
                    <FaList className='inline mr-3' />
                    전체
                </a>
            </li>
            <li>
                <a href='/?category=역사+알아가기' className='hover:underline'>
                    <FaBook className='inline mr-3' />
                    역사 알아가기
                </a>
            </li>
            <li>
                <a href='/?category=자유' className='hover:underline'>
                    <FaComments className='inline mr-3' />
                    자유
                </a>
            </li>
            <li>
                <a href='/?category=질문' className='hover:underline'>
                    <FaQuestionCircle className='inline mr-3' />
                    질문
                </a>
            </li>
            <li>
                <a href='/?category=정보' className='hover:underline'>
                    <FaInfoCircle className='inline mr-3' />
                    정보
                </a>
            </li>
        </ul>
        <h2 className='text-lg font-semibold mt-6 mb-3'>기타</h2>
        <ul className='space-y-2 text-sm'>
            <li>
                <a href='/posts/new' className='hover:underline'>
                    <FaList className='inline mr-3' />새 글 작성
                </a>
            </li>
            <li>
                <a href='/about' className='hover:underline'>
                    <FaDiagramProject className='inline mr-3' />
                    프로젝트 소개
                </a>
            </li>
            <li>
                <a href='https://github.com/yulmwu/smc-project-25-07' className='hover:underline'>
                    <FaGithub className='inline mr-3' />
                    Source Code
                </a>
            </li>
        </ul>
    </div>
)

export default function App({ Component, pageProps }: AppProps) {
    console.log('BASE_URL: ', BASE_URL)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const toggleSidebar = (open: boolean) => {
        setIsSidebarOpen(open)
    }

    const [latestPosts, setLatestPosts] = useState<Post[]>([])

    useEffect(() => {
        const fetchLatestPosts = async () => {
            try {
                const { items } = await getPosts(void 0, void 0, 10) // Fetch latest 10 posts
                setLatestPosts(items)
            } catch (error) {
                console.error('Failed to fetch latest posts:', error)
            }
        }
        fetchLatestPosts()
    }, [])

    return (
        <div className='bg-gray-100 text-gray-900 min-h-screen'>
            {/* 모바일 왼쪽 사이드바 오버레이 */}
            <div
                id='mobileSidebarOverlay'
                className={`fixed inset-0 bg-black bg-opacity-30 z-30 sidebar-overlay ${isSidebarOpen ? '' : 'hidden'}`}
                onClick={() => toggleSidebar(false)}
            ></div>

            {/* 모바일 왼쪽 사이드바 */}
            <div
                id='mobileSidebar'
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className='p-4'>
                    <SidebarContent />
                </div>
            </div>

            {/* 헤더 */}
            <header className='bg-white shadow px-4 py-3 sticky top-0 z-20 flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                    {/* 모바일 전용 햄버거 버튼 */}
                    <button className='lg:hidden p-2 rounded hover:bg-gray-200' onClick={() => toggleSidebar(true)}>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-6 w-6'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M4 6h16M4 12h16M4 18h16'
                            />
                        </svg>
                    </button>
                    <div className='text-xl font-bold ml-3'>
                        <a href='/' className='text-gray-900'>
                            조선인사이드
                        </a>
                    </div>
                </div>
                {/* <nav className='space-x-4 text-sm'>
                    <a href='#' className='text-gray-600 hover:text-black'>
                        홈
                    </a>
                    <a href='#' className='text-gray-600 hover:text-black'>
                        인기
                    </a>
                    <a href='#' className='text-gray-600 hover:text-black'>
                        최신
                    </a>
                </nav> */}
            </header>

            {/* 메인 레이아웃 */}
            <main className='flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 py-6 gap-4'>
                {/* 데스크탑 왼쪽 사이드바 */}
                <aside className='hidden lg:block w-[240px] min-w-[240px] max-w-[240px] flex-shrink-0'>
                    <div className='sticky top-20 bg-white rounded-lg shadow p-4'>
                        <SidebarContent />
                    </div>
                </aside>

                {/* 본문 (게시글 리스트) */}
                <section className='flex-1 space-y-4'>
                    <Component {...pageProps} />
                </section>

                {/* 데스크탑 오른쪽 사이드바 */}
                <aside className='hidden xl:block w-[240px] min-w-[240px] max-w-[240px] flex-shrink-0'>
                    <div className='sticky top-20 bg-white rounded-lg shadow p-4'>
                        <h2 className='text-lg font-semibold mb-3'>최신 게시글 목록</h2>
                        <ul className='space-y-2.5 text-sm'>
                            {latestPosts.map((post) => (
                                <li key={post.id}>
                                    <a href={`/posts/${post.id}`} className='hover:underline'>
                                        <span className='text-xs text-gray-500 mr-1'>[{post.category}]</span>
                                        {post.title}
                                        <span className='text-xs text-gray-400 ml-1'>
                                            {post.commentCount ? `[${post.commentCount}]` : ''}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </main>
        </div>
    )
}
