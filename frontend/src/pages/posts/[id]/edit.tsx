import { useState } from 'react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { getPost, updatePost, Post } from '@/lib/api'

export default function EditPost({ post }: { post: Post }) {
    const router = useRouter()
    const [form, setForm] = useState({
        title: post.title,
        content: post.content,
        password: '',
        category: post.category, // Add category with default
    })
    const [error, setError] = useState('')

    const categories = ['자유', '질문', '정보'] // Example categories

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!form.password || !form.title || !form.content) {
            setError('모든 항목을 입력해주세요.')
            return
        }

        try {
            await updatePost(post.id, form) // Pass form directly, which now includes category
            router.push(`/posts/${post.id}`)
        } catch (err: any) {
            if (err.response && err.response.status === 401) {
                setError('비밀번호가 일치하지 않습니다.')
            } else {
                setError('오류가 발생했습니다. 다시 시도해주세요.')
            }
        }
    }

    return (
        <div className='max-w-3xl mx-auto p-6'>
            <h1 className='text-3xl font-bold mb-8 text-gray-900'>글 수정</h1>
            <form onSubmit={handleSubmit} className='space-y-6 bg-white p-8 rounded-2xl shadow-lg'>
                <input
                    className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    placeholder='작성자'
                    value={post.author}
                    readOnly
                />
                <input
                    className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    placeholder='제목'
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <textarea
                    className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none'
                    placeholder='내용'
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    rows={8}
                />
                {/* Category selection */}
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
                    type='password'
                    className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    placeholder='비밀번호'
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                {error && <p className='text-red-500 text-center mt-4'>{error}</p>} {/* Display error */}
                <button
                    type='submit'
                    className='bg-indigo-600 hover:bg-indigo-700 transition text-white px-8 py-4 rounded-2xl font-semibold shadow'
                >
                    수정하기
                </button>
            </form>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = Number(context.params?.id)
    const post = await getPost(id)
    return { props: { post } }
}
