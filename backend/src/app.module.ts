import { Module } from '@nestjs/common'
import { PostsModule } from './posts/posts.module'
import { CommentsModule } from './comments/comments.module'
import { AppController } from './app.controller'
import { QuizModule } from './quiz/quiz.module'

@Module({
    imports: [PostsModule, CommentsModule, QuizModule],
    controllers: [AppController],
})
export class AppModule {}
