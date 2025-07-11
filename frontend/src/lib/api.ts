import axios from 'axios'

// Quiz Types
export interface QuizQuestion {
    id: number
    question: string
    options: string[]
}

export interface StartQuizResponse {
    message: string
    quiz: QuizQuestion[]
}

export interface SubmitQuizResponse {
    message: string
    score: number
    rank: number
}

export interface Ranking {
    rank: number
    username: string
    score: number
}

export type Post = {
    id: number
    author: string
    title: string
    content: string
    description?: string
    category: string
    tags?: string[]
    createdAt?: string
    updatedAt?: string
    password?: string
    commentCount?: number
    views?: number
    thumbnailUrl?: string
}

export async function validateImageUrl(url: string): Promise<boolean> {
    return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve(true)
        img.onerror = () => resolve(false)
        img.src = url
    })
}

export type Comment = {
    id: string
    postId: number
    author: string
    content: string
    createdAt: string
    password?: string
}

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

export type PaginatedPosts = {
    items: Post[]
    nextCursor: number | null // Changed back to number | null
}

export const getPosts = async (
    category?: string,
    cursor?: number | null,
    limit: number = 10
): Promise<PaginatedPosts> => {
    // Modified cursor type
    const url = category && category !== '전체' ? `/posts/category/${encodeURIComponent(category)}` : '/posts'
    const res = await api.get<PaginatedPosts>(url, {
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

// Quiz API Functions
export const startQuiz = async (username: string): Promise<StartQuizResponse> => {
    const res = await api.post<StartQuizResponse>('/quiz', { username })
    return res.data
}

export const submitQuiz = async (username: string, answers: string[]): Promise<SubmitQuizResponse> => {
    const res = await api.post<SubmitQuizResponse>('/quiz/submit', { username, answers })
    return res.data
}

export const getRankings = async (): Promise<Ranking[]> => {
    const res = await api.get<Ranking[]>('/quiz/rankings')
    return res.data
}

export default api
