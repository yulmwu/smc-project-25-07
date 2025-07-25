import { BASE_URL, getPosts, Post } from '@/lib/api'
import './globals.css'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import {
    FaBook,
    FaBookOpen,
    FaCloud,
    FaComments,
    FaDog,
    FaGithub,
    FaInfoCircle,
    FaList,
    FaQuestionCircle,
} from 'react-icons/fa'
import { FaBoltLightning, FaDiagramProject } from 'react-icons/fa6'

export const SidebarContent = () => (
    <div>
        <h2 className='text-lg font-semibold mb-2'>카테고리</h2>
        <ul className='space-y-2 text-sm ml-2'>
            <li>
                <a href='/?category=전체' className='hover:underline'>
                    <FaList className='inline mr-3' />
                    전체
                </a>
            </li>
            <li>
                <a href='/?category=동물' className='hover:underline'>
                    <FaDog className='inline mr-3' />
                    동물
                </a>
            </li>
            <li>
                <a href='/?category=날씨%2F기후' className='hover:underline'>
                    <FaCloud className='inline mr-3' />
                    날씨/기후
                </a>
            </li>
            <li>
                <a href='/?category=자연재해' className='hover:underline'>
                    <FaBoltLightning className='inline mr-3' />
                    자연재해
                </a>
            </li>
            <li>
                <a href='/?category=자유' className='hover:underline'>
                    <FaComments className='inline mr-3' />
                    커뮤니티: 자유
                </a>
            </li>
            <li>
                <a href='/?category=질문' className='hover:underline'>
                    <FaQuestionCircle className='inline mr-3' />
                    커뮤니티: 질문
                </a>
            </li>
            <li>
                <a href='/?category=정보' className='hover:underline'>
                    <FaInfoCircle className='inline mr-3' />
                    커뮤니티: 정보
                </a>
            </li>
        </ul>
        <h2 className='text-lg font-semibold mt-6 mb-2'>위키 바로가기</h2>
        <ul className='space-y-2 text-sm ml-2'>
            <li>
                <a href='/wiki?tab=animal' className='hover:underline'>
                    <FaBookOpen className='inline mr-3' />
                    동물
                </a>
            </li>
            <li>
                <a href='/wiki?tab=weather' className='hover:underline'>
                    <FaBookOpen className='inline mr-3' />
                    날씨
                </a>
            </li>
            <li>
                <a href='/wiki?tab=naturalDisaster' className='hover:underline'>
                    <FaBookOpen className='inline mr-3' />
                    자연재해
                </a>
            </li>
            <li>
                <a href='/wiki?tab=accident' className='hover:underline'>
                    <FaBookOpen className='inline mr-3' />
                    사건사고
                </a>
            </li>
        </ul>
        <h2 className='text-lg font-semibold mt-6 mb-2'>퀴즈 바로가기</h2>
        <ul className='space-y-2 text-sm ml-2'>
            <li>
                <a href='/quiz' className='hover:underline'>
                    <FaQuestionCircle className='inline mr-3' />
                    퀴즈 시작하기
                </a>
            </li>
            <li>
                <a href='/quiz/ranking' className='hover:underline'>
                    <FaList className='inline mr-3' />
                    퀴즈 랭킹 보기
                </a>
            </li>
        </ul>
        <h2 className='text-lg font-semibold mt-6 mb-2'>기타</h2>
        <ul className='space-y-2 text-sm ml-2'>
            <li>
                <a href='/about' className='hover:underline'>
                    <FaDiagramProject className='inline mr-3' />
                    프로젝트 소개
                </a>
            </li>
            <li>
                <a href='/ppt' className='hover:underline'>
                    <FaDiagramProject className='inline mr-3' />
                    발표 자료 보기
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

            <div
                id='mobileSidebar'
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } overflow-y-auto`}
            >
                <div className='pl-5 pr-4 pt-4 pb-4'>
                    <SidebarContent />
                </div>
            </div>

            {/* 헤더 */}
            <header className='bg-white shadow px-4 py-3 sticky top-0 z-20 flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                    <button
                        className='lg:hidden p-2 rounded hover:bg-gray-200 cursor-pointer'
                        onClick={() => toggleSidebar(true)}
                    >
                        <FaList className='text-gray-600' />
                    </button>
                    <a href='/'>
                        <img src='/chosun32.png' alt='logo' className='h-8 w-auto rounded-sm' />
                    </a>
                    <div className='text-sm sm:text-lg md:text-xl font-bold ml-3 flex items-center gap-5'>
                        <a href='/' className='text-gray-600 hover:text-gray-900 flex items-center gap-1'>
                            조선인사이드
                        </a>
                        <div className='h-5 w-[2px] bg-gray-300' />
                        <a href='/wiki' className='text-gray-600 hover:text-gray-800 flex items-center gap-1'>
                            위키
                        </a>
                        <div className='h-5 w-[2px] bg-gray-300' />
                        <a href='/quiz' className='text-gray-600 hover:text-gray-800 flex items-center gap-1'>
                            퀴즈
                        </a>
                    </div>
                </div>
            </header>

            {/* 메인 레이아웃 */}
            <main className='max-w-screen-2xl mx-auto flex flex-col lg:flex-row px-4 py-6'>
                <aside className='hidden lg:block w-[280px] flex-shrink-0 pr-4'>
                    <div className='sticky top-20 bg-white rounded-lg shadow p-4'>
                        <SidebarContent />
                    </div>
                </aside>

                <section className='flex-1'>
                    <Component {...pageProps} />
                </section>

                <aside className='hidden xl:block w-[280px] flex-shrink-0 pl-4'>
                    <div className='sticky top-20 bg-white rounded-lg shadow p-4'>
                        <h2 className='text-lg font-semibold mb-3'>최신 게시글 목록 (10개)</h2>
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
