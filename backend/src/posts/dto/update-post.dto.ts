export class UpdatePostDto {
    password: string
    title?: string
    content?: string
    description?: string
    category?: string
    tags?: string[]
    thumbnailUrl?: string
    forDevelopmentUpdateAtDate?: string
}
