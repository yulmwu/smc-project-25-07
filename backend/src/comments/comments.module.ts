import { Module } from '@nestjs/common'
import { CommentsService } from './comments.service'
import { CommentsController } from './comments.controller'
import { DynamoDBService } from '../common/dynamodb/dynamodb.service'
import { PostsModule } from '../posts/posts.module' // Import PostsModule

@Module({
    imports: [PostsModule],
    controllers: [CommentsController],
    providers: [CommentsService, DynamoDBService],
})
export class CommentsModule {}
