import { Module } from '@nestjs/common'
import { PostsModule } from './posts/posts.module'
import { CommentsModule } from './comments/comments.module'
import { AppController } from './app.controller'

@Module({
    imports: [AppController, PostsModule, CommentsModule],
})
export class AppModule {}
