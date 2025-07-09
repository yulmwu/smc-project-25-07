import axios from 'axios'

export type Post = {
    id: number
    author: string
    title: string
    content: string
    createdAt?: string
    updatedAt?: string
    password?: string
}

export type Comment = {
    id: string
    postId: number
    author: string
    content: string
    createdAt: string
    password?: string
}

export const BASE_URL = process.env.DEVELOPMENT ? 'http://localhost:3000/api' : 'http://localhost:3000/api'

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

export type PaginatedPosts = {
    items: Post[]
    nextCursor: number | null
}

export const getPosts = async (cursor?: number, limit: number = 10): Promise<PaginatedPosts> => {
    const res = await api.get<PaginatedPosts>('/posts', {
        params: {
            cursor,
            limit,
        },
    })

    return res.data
}

export async function getPost(id: number): Promise<Post> {
    const res = await api.get<Post>(`/posts/${id}`)
    return res.data
}

export async function createPost(data: Omit<Post, 'id'>) {
    const res = await api.post<Post>('/posts', data)
    return res.data
}

export async function updatePost(id: number, data: Partial<Post> & { password: string }) {
    const res = await api.put<Post>(`/posts/${id}`, data)
    return res.data
}

export async function deletePost(id: number, password: string) {
    const res = await api.delete<Post>(`/posts/${id}`, { data: { password } })
    return res.data
}

export async function getComments(postId: number): Promise<Comment[]> {
    const res = await api.get<Comment[]>(`/comments/post/${postId}`)
    return res.data
}

export async function createComment(postId: number, data: Omit<Comment, 'id' | 'postId' | 'createdAt'>) {
    const res = await api.post<Comment>(`/comments/post/${postId}`, { postId, ...data })
    return res.data
}

export async function updateComment(id: string, data: Partial<Comment> & { password: string }) {
    const res = await api.put<Comment>(`/comments/${id}`, data)
    return res.data
}

export async function deleteComment(id: string, password: string) {
    const res = await api.delete<Comment>(`/comments/${id}`, { data: { password } })
    return res.data
}
