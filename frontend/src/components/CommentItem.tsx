
import { useState } from 'react'
import { Comment, updateComment, deleteComment } from '@/lib/api'
import { useRouter } from 'next/router'
import PasswordModal from '@/components/PasswordModal' // Import PasswordModal

export default function CommentItem({ comment }: { comment: Comment }) {
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [content, setContent] = useState(comment.content)
    const [showPasswordModal, setShowPasswordModal] = useState(false) // State for modal visibility
    const [modalAction, setModalAction] = useState<'delete' | 'edit' | null>(null) // State for action type
    const [modalError, setModalError] = useState('') // State for modal error message

    const handlePasswordConfirm = async (password: string) => {
        try {
            if (modalAction === 'delete') {
                if (!confirm('정말 삭제하시겠습니까?')) {
                    setShowPasswordModal(false);
                    return;
                }
                await deleteComment(comment.id, password)
                router.reload()
            } else if (modalAction === 'edit') {
                await updateComment(comment.id, { content, password })
                setIsEditing(false) // Exit editing mode on successful update
                router.reload()
            }
            setShowPasswordModal(false) // Close modal on success
            setModalError('') // Clear any previous errors
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                setModalError('비밀번호가 일치하지 않습니다.')
            } else {
                setModalError('오류가 발생했습니다. 다시 시도해주세요.')
            }
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
                        <button
                            onClick={() => { setModalAction('edit'); setShowPasswordModal(true); setModalError(''); }}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                        >
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
                        <button
                            onClick={() => { setIsEditing(true); setModalAction('edit'); setShowPasswordModal(true); setModalError(''); }}
                            className="text-indigo-600"
                        >
                            수정
                        </button>
                        <button
                            onClick={() => { setModalAction('delete'); setShowPasswordModal(true); setModalError(''); }}
                            className="text-red-600"
                        >
                            삭제
                        </button>
                    </div>
                </div>
            )}

            <PasswordModal
                isOpen={showPasswordModal}
                onClose={() => { setShowPasswordModal(false); setModalError(''); }}
                onConfirm={handlePasswordConfirm}
                title={modalAction === 'delete' ? '댓글 삭제' : '댓글 수정'}
                description={modalAction === 'delete' ? '댓글을 삭제하려면 비밀번호를 입력해주세요.' : '댓글을 수정하려면 비밀번호를 입력해주세요.'}
                errorMessage={modalError}
            />
        </li>
    )
}
