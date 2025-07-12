import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common'
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
    findAll(@Query('cursor') cursor?: string, @Query('limit') limit?: string) {
        return this.postsService.findAll(cursor ? parseInt(cursor, 10) : void 0, limit ? parseInt(limit, 10) : void 0)
    }

    @Get('category/:category') // Add this endpoint
    findByCategory(
        @Param('category') category: string,
        @Query('cursor') cursor?: string,
        @Query('limit') limit?: string
    ) {
        return this.postsService.findByCategory(
            category,
            cursor ? parseInt(cursor, 10) : void 0,
            limit ? parseInt(limit, 10) : void 0
        );
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Query('incViews') incViews?: string) {
        return this.postsService.findOne(parseInt(id, 10), incViews === 'true')
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
