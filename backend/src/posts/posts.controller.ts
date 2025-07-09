import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common'
import { PostsService } from './posts.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Post()
    create(@Body() createPostDto: CreatePostDto) {
        return this.postsService.create(createPostDto)
    }

    @Get()
    findAll() {
        return this.postsService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(parseInt(id, 10))
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
        return this.postsService.update(parseInt(id, 10), updatePostDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Body('password') password: string) {
        return this.postsService.remove(parseInt(id, 10), password)
    }
}
