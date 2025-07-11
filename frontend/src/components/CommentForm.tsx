import { useState } from 'react'
import { createComment } from '@/lib/api'

export default function CommentForm({ postId, onSubmitted }: { postId: number; onSubmitted: () => void }) {
    const [form, setForm] = useState({ author: '', content: '', password: '' })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.author || !form.password || !form.content) {
            alert('모든 항목을 입력해주세요.')
            return
        }
        await createComment(postId, form)
        setForm({ author: '', content: '', password: '' })
        onSubmitted()
    }

    return (
        <form onSubmit={handleSubmit} className='mt-8 space-y-4 bg-white p-6 rounded-2xl shadow-lg'>
            <h3 className='text-xl font-semibold mb-4'>댓글 작성하기</h3>
            <input
                type='text'
                placeholder='작성자'
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
            <input
                type='password'
                placeholder='비밀번호'
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
            <textarea
                placeholder='댓글 내용'
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={4}
                className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none'
            />
            <button
                type='submit'
                className='bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-3 rounded-lg font-semibold shadow cursor-pointer'
            >
                댓글 달기
            </button>
        </form>
    )
}
