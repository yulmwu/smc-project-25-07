export class CreatePostDto {
    author: string
    password: string
    title: string
    content: string
    description?: string
    category: string
    tags?: string[]
    views: number
    thumbnailUrl?: string
    forDevelopmentCreateAtDate?: string
}
