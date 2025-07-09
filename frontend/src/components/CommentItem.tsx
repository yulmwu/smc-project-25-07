
import { useState } from 'react'
import { Comment, updateComment, deleteComment } from '@/lib/api'
import { useRouter } from 'next/router'

export default function CommentItem({ comment }: { comment: Comment }) {
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [content, setContent] = useState(comment.content)
    const [password, setPassword] = useState('')

    const handleDelete = async () => {
        if (!password) {
            alert('비밀번호를 입력해주세요.')
            return
        }
        if (!confirm('정말 삭제하시겠습니까?')) return
        try {
            await deleteComment(comment.id, password)
            router.reload()
        } catch (error) {
            alert('비밀번호가 틀렸습니다.')
        }
    }

    const handleUpdate = async () => {
        if (!password) {
            alert('비밀번호를 입력해주세요.')
            return
        }
        try {
            await updateComment(comment.id, { content, password })
            setIsEditing(false)
            router.reload()
        } catch (error) {
            alert('비밀번호가 틀렸습니다.')
        }
    }

    return (
        <li className="bg-gray-50 rounded-xl p-4 shadow-sm">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>
                    작성자: <strong>{comment.author}</strong>
                </span>
                <time>{comment.createdAt.slice(0, 10)}</time>
            </div>
            {isEditing ? (
                <div>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                    <div className="flex items-center space-x-3 mt-2">
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                        />
                        <button onClick={handleUpdate} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
                            저장
                        </button>
                        <button onClick={() => setIsEditing(false)} className="border px-4 py-2 rounded-lg">
                            취소
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <p className="text-gray-800 whitespace-pre-wrap">{comment.content}</p>
                    <div className="flex items-center space-x-3 mt-2">
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                        />
                        <button onClick={() => setIsEditing(true)} className="text-indigo-600">
                            수정
                        </button>
                        <button onClick={handleDelete} className="text-red-600">
                            삭제
                        </button>
                    </div>
                </div>
            )}
        </li>
    )
}
