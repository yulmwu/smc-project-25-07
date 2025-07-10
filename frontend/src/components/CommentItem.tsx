import { useState } from 'react'
import { Comment, updateComment, deleteComment } from '@/lib/api'
import { useRouter } from 'next/router'
import PasswordModal from '@/components/PasswordModal'
import dayjs from 'dayjs'

export default function CommentItem({ comment }: { comment: Comment }) {
    const router = useRouter()
    const [content, setContent] = useState(comment.content)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [modalAction, setModalAction] = useState<'delete' | 'edit' | null>(null)
    const [modalError, setModalError] = useState('')

    const handlePasswordConfirm = async (password: string) => {
        try {
            if (modalAction === 'delete') {
                if (!confirm('정말 삭제하시겠습니까?')) {
                    setShowPasswordModal(false)
                    return
                }
                await deleteComment(comment.id, password)
                router.reload()
            }
            setShowPasswordModal(false)
            setModalError('')
        } catch (error: any) {
            if (error.response && error.response.data.type === 'password') {
                setModalError('비밀번호가 일치하지 않습니다.')
            } else {
                setModalError('오류가 발생했습니다. 다시 시도해주세요.')
            }
        }
    }

    return (
        <li className='bg-white p-4 rounded-lg shadow mb-4'>
            <div className='flex justify-between text-sm text-gray-400'>
                <span>
                    작성자: <strong className='text-gray-500'>{comment.author}</strong>
                </span>
                <p className='text-gray-400'>{dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm')}</p>
            </div>
            <hr className='border-gray-200 mb-3 mt-3' />
            <p className='text-gray-800 whitespace-pre-wrap mb-5'>{comment.content}</p>
            <div className='flex items-center space-x-3'>
                <button
                    onClick={() => {
                        setModalAction('delete')
                        setShowPasswordModal(true)
                        setModalError('')
                    }}
                    className='text-red-600'
                >
                    삭제
                </button>
            </div>
            <PasswordModal
                isOpen={showPasswordModal}
                onClose={() => {
                    setShowPasswordModal(false)
                    setModalError('')
                }}
                onConfirm={handlePasswordConfirm}
                title={modalAction === 'delete' ? '댓글 삭제' : '댓글 수정'}
                description={
                    modalAction === 'delete'
                        ? '댓글을 삭제하려면 비밀번호를 입력해주세요.'
                        : '댓글을 수정하려면 비밀번호를 입력해주세요.'
                }
                errorMessage={modalError}
            />
        </li>
    )
}
