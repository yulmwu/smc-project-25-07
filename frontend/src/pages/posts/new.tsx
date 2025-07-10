import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { createPost } from '@/lib/api'

export default function NewPost() {
    const router = useRouter()
    const [form, setForm] = useState({ author: '', password: '', title: '', content: '', category: '자유' })

    const categories = ['자유', '질문', '정보'];

    useEffect(() => {
        if (router.query.category) {
            setForm((prevForm) => ({
                ...prevForm,
                category: router.query.category as string,
            }));
        }
    }, [router.query.category]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.author || !form.password || !form.title || !form.content) {
            alert('모든 항목을 입력해주세요.')
            return
        }
        await createPost(form)
        // Redirect to home page with category and refresh parameter
        if (form.category === '전체' || form.category === '분류 없음') { // "전체" 또는 "분류 없음"은 쿼리 파라미터 없이
            router.push(`/?refresh=true`);
        } else {
            router.push(`/?category=${encodeURIComponent(form.category)}&refresh=true`);
        }
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
                {/* Category selection dropdown */}
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