import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { createPost, Post, validateImageUrl } from '@/lib/api'

export default function NewPost() {
    const router = useRouter()
    const [form, setForm] = useState<Omit<Post, 'id'>>({
        author: '',
        password: '',
        title: '',
        content: '',
        description: '',
        category: '자유',
        tags: [],
        thumbnailUrl: '',
        forDevelopmentCreateAtDate: new Date().toISOString(),
    })
    const [useThumbnail, setUseThumbnail] = useState(false)
    const [thumbnailError, setThumbnailError] = useState('')

    const categories = ['동물', '날씨/기후', '자연재해', '자유', '질문', '정보', '기타']

    useEffect(() => {
        if (router.query.category) {
            const c = router.query.category as string
            setForm((prevForm) => ({
                ...prevForm,
                category: c === '전체' ? '자유' : c,
            }))
        }
    }, [router.query.category])

    const handleThumbnailUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value
        setForm({ ...form, thumbnailUrl: url })
        if (url) {
            const isValid = await validateImageUrl(url)
            if (!isValid) {
                setThumbnailError('유효하지 않은 이미지 URL입니다.')
            } else {
                setThumbnailError('')
            }
        } else {
            setThumbnailError('')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.author || !form.password || !form.title || !form.content) {
            alert('모든 항목을 입력해주세요.')
            return
        }

        if (useThumbnail && thumbnailError) {
            alert('썸네일 URL을 확인해주세요.')
            return
        }

        const postData = { ...form }
        if (!useThumbnail) {
            postData.thumbnailUrl = '' // 썸네일 사용 안함 토글 시 URL 비움
        }

        console.log(form)

        await createPost(postData)

        router.push(`/?category=${encodeURIComponent(form.category)}&refresh=true`)
    }

    return (
        <>
            <title>조선인사이드 - 게시글 작성</title>
            <div className='mx-auto p-1'>
                <h1 className='text-3xl font-bold mb-8 text-gray-900'>새 글 작성</h1>
                <form onSubmit={handleSubmit} className='space-y-6 bg-white p-8 rounded-2xl shadow-lg'>
                    <input
                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='제목'
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                    <select
                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    <input
                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none'
                        placeholder='설명'
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                    <textarea
                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none'
                        placeholder='내용'
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        rows={8}
                    />
                    <input
                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='태그 (쉼표로 구분)'
                        value={(form.tags ?? []).join(', ')}
                        onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map((tag) => tag.trim()) })}
                    />
                    <input
                        className='bg-red-200 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='ISO 8601 형식 날짜 (개발용)'
                        onChange={(e) => setForm({ ...form, forDevelopmentCreateAtDate: e.target.value })}
                        value={form.forDevelopmentCreateAtDate}
                    />

                    <div className='flex items-center space-x-2'>
                        <input
                            type='checkbox'
                            id='useThumbnail'
                            checked={useThumbnail}
                            onChange={(e) => setUseThumbnail(e.target.checked)}
                            className='form-checkbox h-5 w-5 text-indigo-600'
                        />
                        <label htmlFor='useThumbnail' className='text-gray-700'>
                            썸네일 이미지 사용
                        </label>
                    </div>

                    {useThumbnail && (
                        <div>
                            <input
                                className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                placeholder='썸네일 이미지 URL (선택 사항)'
                                value={form.thumbnailUrl}
                                onChange={handleThumbnailUrlChange}
                            />
                            {thumbnailError && <p className='text-red-500 text-sm mt-1'>{thumbnailError}</p>}
                        </div>
                    )}

                    <hr className='border-gray-200 mb-5 mt-5' />

                    <input
                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='작성자'
                        value={form.author}
                        onChange={(e) => setForm({ ...form, author: e.target.value })}
                    />

                    <input
                        type='password'
                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='비밀번호'
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <button
                        type='submit'
                        className='bg-indigo-600 hover:bg-indigo-700 transition text-white px-8 py-4 rounded-2xl font-semibold shadow cursor-pointer'
                    >
                        등록하기
                    </button>
                </form>
            </div>
        </>
    )
}
