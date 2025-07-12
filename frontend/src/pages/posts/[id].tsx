import { GetServerSideProps } from 'next'
import { getPost, getComments, Post, Comment, deletePost } from '@/lib/api'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import CommentForm from '@/components/CommentForm'
import CommentItem from '@/components/CommentItem'
import PasswordModal from '@/components/PasswordModal'
import dayjs from 'dayjs'
import Head from 'next/head'
import Markdown from '@/components/Markdown'

export default function PostDetail({ post, comments }: { post: Post; comments: Comment[] }) {
    if (!post) {
        return <div className='text-center text-gray-500 mt-10'>게시글을 찾을 수 없습니다.</div>
    }

    const router = useRouter()
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [modalAction, setModalAction] = useState<'delete' | 'edit' | null>(null)
    const [modalError, setModalError] = useState('')

    useEffect(() => {
        if (router.query.error) {
            alert('오류가 발생했습니다. 다시 시도해주세요.')
            router.replace(`/posts/${post.id}`, undefined, { shallow: true })
        }
    }, [router.query.error, router, post.id])

    const handlePasswordConfirm = async (password: string) => {
        try {
            if (modalAction === 'delete') {
                await deletePost(post.id, password)
                router.push('/?refresh=true')
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
        <>
            <Head>
                <title>{`조선인사이드 - ${post.title}`}</title>
            </Head>
            <div className='mx-auto p-1'>
                <article className='bg-white rounded-2xl shadow-lg p-8 mb-10'>
                    {post.thumbnailUrl && (
                        <div className='mb-10'>
                            <a href={post.thumbnailUrl} target='_blank' rel='noopener noreferrer'>
                                <img
                                    src={post.thumbnailUrl}
                                    alt='썸네일'
                                    className='w-full h-64 object-cover rounded-lg transition-transform duration-300 hover:scale-101 cursor-pointer'
                                />
                            </a>
                        </div>
                    )}
                    <p className='text-blue-500 text-xl mb-2'>
                        <a
                            href={`/?category=${encodeURIComponent(post.category ?? '전체')}`}
                            className='hover:underline'
                        >
                            {post.category ? `${post.category}` : '분류 없음'}
                        </a>
                    </p>
                    <h1 className='text-3xl font-bold text-gray-900 mb-5'>
                        <span>{post.title}</span>
                    </h1>
                    <div className='text-gray-600 text-sm flex justify-between items-center'>
                        <div>
                            <span>
                                작성자: <strong>{post.author}</strong>
                            </span>
                        </div>
                        <p className='text-gray-400 text-xs'>
                            <span>{dayjs(post.createdAt).format('YYYY-MM-DD HH:mm')}</span>
                            <span className='ml-3'>조회수: {post.views ?? 0}</span>
                        </p>
                    </div>
                    {post.description && (
                        <section className='max-w-none mt-5 mb-5'>
                            <p className='text-gray-800 whitespace-pre-wrap line-clamp-2'>
                                {post.description.replace(/\n/g, ' ')}
                            </p>
                        </section>
                    )}
                    <hr className='border-gray-200 mb-5 mt-5' />
                    <section className='max-w-none'>
                        <Markdown content={post.content} />
                    </section>
                    {post.tags && post.tags.length > 0 && (
                        <div className='mt-10'>
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className='inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-pointer hover:bg-gray-300 transition duration-200'
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                    <div className='mt-3 flex justify-end space-x-3'>
                        <button
                            onClick={() => {
                                setModalAction('delete')
                                setShowPasswordModal(true)
                                setModalError('')
                            }}
                            className='bg-red-600 hover:bg-red-700 transition text-white px-5 py-2 rounded-lg font-semibold shadow cursor-pointer'
                        >
                            삭제
                        </button>
                        <button
                            onClick={() => router.push(`/posts/${post.id}/edit`)}
                            className='border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition px-5 py-2 rounded-lg font-semibold cursor-pointer'
                        >
                            수정
                        </button>
                    </div>
                </article>

                <section>
                    <h2 className='text-2xl font-semibold mb-6'>댓글 ({comments.length})</h2>
                    <ul className='space-y-4'>
                        {comments.map((c) => (
                            <CommentItem key={c.id} comment={c} />
                        ))}
                    </ul>

                    <CommentForm postId={post.id} onSubmitted={() => router.reload()} />
                </section>

                <PasswordModal
                    isOpen={showPasswordModal}
                    onClose={() => {
                        setShowPasswordModal(false)
                        setModalError('')
                    }}
                    onConfirm={handlePasswordConfirm}
                    title={'게시글 삭제'}
                    description={'게시글을 삭제하려면 비밀번호를 입력해주세요.'}
                    errorMessage={modalError}
                />
            </div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = Number(context.params?.id)
    const post = await getPost(id, true)

    const comments = await getComments(id)
    return { props: { post, comments } }
}
