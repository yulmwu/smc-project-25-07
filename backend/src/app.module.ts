import { Module } from '@nestjs/common'
import { PostsModule } from './posts/posts.module'
import { CommentsModule } from './comments/comments.module'
import { AppController } from './app.controller'

@Module({
    imports: [PostsModule, CommentsModule],
    controllers: [AppController],
})
export class AppModule {}
