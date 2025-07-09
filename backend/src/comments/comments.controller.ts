import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common'
import { CommentsService } from './comments.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Get('/post/:postId')
    findByPost(@Param('postId') postId: string) {
        const id = parseInt(postId, 10)
        return this.commentsService.findByPost(id)
    }

    @Post('/post/:postId')
    create(@Param('postId') postId: string, @Body() dto: CreateCommentDto) {
        return this.commentsService.create(dto, parseInt(postId, 10))
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
