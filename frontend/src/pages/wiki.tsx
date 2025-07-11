import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Markdown from '@/components/Markdown'
import { wikiContent } from '@/wiki.data'

const WikiPage: React.FC = () => {
    const router = useRouter()
    const { tab, lang } = router.query
    const [activeTab, setActiveTab] = useState<string>((tab as string) || 'animal')
    const [currentLang, setCurrentLang] = useState<'ko' | 'en'>((lang as 'ko' | 'en') || 'ko')

    useEffect(() => {
        if (router.isReady) {
            const { tab, lang } = router.query
            if (tab && typeof tab === 'string' && wikiContent[tab]) {
                setActiveTab(tab)
            } else {
                setActiveTab('animal') // Default to 'animal' if tab is not valid or not present
            }
            if (lang === 'en') {
                setCurrentLang('en')
            } else {
                setCurrentLang('ko')
            }
        }
    }, [router.isReady, router.query.tab, router.query.lang])

    const handleTabClick = (key: string) => {
        setActiveTab(key)
        router.push(`/wiki?tab=${key}&lang=${currentLang}`, undefined, { shallow: true })
    }

    const handleLangToggle = () => {
        const newLang = currentLang === 'ko' ? 'en' : 'ko'
        setCurrentLang(newLang)
        router.push(`/wiki?tab=${activeTab}&lang=${newLang}`, undefined, { shallow: true })
    }

    const currentContent = wikiContent[activeTab]?.[currentLang] || wikiContent.animal[currentLang]

    return (
        <>
            <Head>
                <title>{`조선인사이드 - ${currentContent.title} 위키`}</title>
            </Head>
            <div className='flex justify-between items-center mb-5'>
                <h1 className='text-4xl font-extrabold text-gray-900'>{currentLang === 'ko' ? '위키' : 'Wiki'}</h1>
                <button
                    onClick={handleLangToggle}
                    className='px-4 py-2 rounded-full text-sm sm:text-base transition-colors duration-200 ease-in-out cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300'
                >
                    {currentLang === 'ko' ? 'English' : '한국어'}
                </button>
            </div>

            <div className='flex space-x-2 mb-2 overflow-x-auto pb-2 whitespace-nowrap'>
                {Object.keys(wikiContent).map((key) => (
                    <button
                        key={key}
                        onClick={() => handleTabClick(key)}
                        className={`px-4 py-2 rounded-full text-sm sm:text-base transition-colors duration-200 ease-in-out cursor-pointer
              ${
                  activeTab === key
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
                    >
                        {wikiContent[key][currentLang].title}
                    </button>
                ))}
            </div>

            <div className='bg-white shadow-xl rounded-lg p-6 sm:p-8 lg:p-10'>
                <h2 className='text-2xl sm:text-3xl font-bold mb-6 text-gray-800 border-b pb-4'>
                    {currentContent.title}
                </h2>
                <div className='prose prose-lg max-w-none text-gray-700 leading-relaxed'>
                    <Markdown content={currentContent.content} />
                </div>
            </div>
        </>
    )
}

export default WikiPage
