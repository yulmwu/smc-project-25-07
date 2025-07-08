import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common'
import { CommentsService } from './comments.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Post()
    create(@Body() dto: CreateCommentDto) {
        return this.commentsService.create(dto)
    }

    @Get('/post/:postId')
    findByPost(@Param('postId') postId: string) {
        const id = parseInt(postId, 10)
        return this.commentsService.findByPost(id)
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateCommentDto) {
        return this.commentsService.update(id, dto)
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Body('password') password: string) {
        return this.commentsService.remove(id, password)
    }
}
