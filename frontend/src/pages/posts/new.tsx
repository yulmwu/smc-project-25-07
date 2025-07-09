import { useState } from 'react'
import { useRouter } from 'next/router'
import { createPost } from '@/lib/api'

export default function NewPost() {
    const router = useRouter()
    const [form, setForm] = useState({ author: '', password: '', title: '', content: '' })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.author || !form.password || !form.title || !form.content) {
            alert('모든 항목을 입력해주세요.')
            return
        }
        await createPost(form)
        router.push('/')
    }

    return (
        <div className='max-w-3xl mx-auto p-6'>
            <h1 className='text-3xl font-bold mb-8 text-gray-900'>새 글 작성</h1>
            <form onSubmit={handleSubmit} className='space-y-6 bg-white p-8 rounded-2xl shadow-lg'>
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
                <button
                    type='submit'
                    className='bg-indigo-600 hover:bg-indigo-700 transition text-white px-8 py-4 rounded-2xl font-semibold shadow'
                >
                    등록하기
                </button>
            </form>
        </div>
    )
}
