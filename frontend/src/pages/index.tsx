import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { getPosts, Post } from '@/lib/api'

interface HomeProps {
    posts: Post[]
}

export default function Home({ posts }: HomeProps) {
    return (
        <div className='max-w-3xl mx-auto p-6'>
            <h1 className='text-4xl font-extrabold text-gray-900 mb-8'>익명 게시판</h1>
            <Link
                href='/posts/new'
                className='inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 transition'
            >
                새 글 작성
            </Link>
            <ul className='mt-8 space-y-6'>
                {posts.map((post) => (
                    <li
                        key={post.id}
                        className='border rounded-xl shadow-sm hover:shadow-md transition p-6 bg-white cursor-pointer'
                    >
                        <Link href={`/posts/${post.id}`}>
                            <h2 className='text-2xl font-semibold text-gray-800 mb-1 truncate'>{post.title}</h2>
                            <p className='text-gray-500 text-sm'>
                                작성자: <span className='font-medium text-gray-700'>{post.author}</span>
                            </p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
    const posts = await getPosts()
    return {
        props: {
            posts,
        },
    }
}
