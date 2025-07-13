import { useState } from 'react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { getPost, updatePost, Post, validateImageUrl } from '@/lib/api'
import Head from 'next/head'

export default function EditPost({ post }: { post: Post }) {
    const router = useRouter()
    const [form, setForm] = useState({
        title: post.title,
        content: post.content,
        description: post.description,
        tags: post.tags,
        password: '',
        category: post.category,
        thumbnailUrl: post.thumbnailUrl ?? '',
    })
    const [useThumbnail, setUseThumbnail] = useState(!!post.thumbnailUrl)
    const [thumbnailError, setThumbnailError] = useState('')
    const [error, setError] = useState('')

    const categories = ['자유', '질문', '정보', '기타']

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
        setError('')

        if (!form.password || !form.title || !form.content) {
            setError('모든 항목을 입력해주세요.')
            return
        }

        if (useThumbnail && thumbnailError) {
            setError('썸네일 URL을 확인해주세요.')
            return
        }

        const postData = { ...form }
        if (!useThumbnail) {
            postData.thumbnailUrl = ''
        }

        console.log('Submitting post data:', postData)

        try {
            await updatePost(post.id, postData)
            router.push(`/posts/${post.id}`)
        } catch (err: any) {
            console.log('Error updating post:', err)
            if (err.response && err.response.data.type === 'password') {
                setError('비밀번호가 일치하지 않습니다.')
            } else {
                setError('오류가 발생했습니다. 다시 시도해주세요.')
            }
        }
    }

    return (
        <>
            <Head>
                <title>조선인사이드 - 글 수정</title>
            </Head>
            <div>
                <title>조선인사이드 - 게시글</title>
                <div className='mx-auto p-1'>
                    <h1 className='text-3xl font-bold mb-8 text-gray-900'>글 수정</h1>
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
                            value={form.tags!.join(', ')}
                            onChange={(e) =>
                                setForm({ ...form, tags: e.target.value.split(',').map((tag) => tag.trim()) })
                            }
                        />
                        <div className='flex items-center space-x-2'>
                            <input
                                type='checkbox'
                                id='useThumbnail'
                                checked={useThumbnail}
                                onChange={(e) => setUseThumbnail(e.target.checked)}
                                className='form-checkbox h-5 w-5 text-indigo-600 cursor-pointer'
                            />
                            <label htmlFor='useThumbnail' className='text-gray-700 cursor-pointer'>
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
                            value={post.author}
                            readOnly
                        />
                        <input
                            type='password'
                            className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            placeholder='비밀번호'
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                        {error && <p className='text-red-500 text-center'>{error}</p>} {/* Display error */}
                        <button
                            type='submit'
                            className='bg-indigo-600 hover:bg-indigo-700 transition text-white px-8 py-4 rounded-2xl font-semibold shadow cursor-pointer'
                        >
                            수정하기
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = Number(context.params?.id)
    const post = await getPost(id)
    return { props: { post } }
}
