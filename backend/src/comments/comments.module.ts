import { Module, forwardRef } from '@nestjs/common'
import { CommentsService } from './comments.service'
import { CommentsController } from './comments.controller'
import { DynamoDBService } from '../common/dynamodb/dynamodb.service'
import { PostsModule } from '../posts/posts.module' // Import PostsModule

@Module({
    imports: [forwardRef(() => PostsModule)],
    controllers: [CommentsController],
    providers: [CommentsService, DynamoDBService],
    exports: [CommentsService],
})
export class CommentsModule {}
