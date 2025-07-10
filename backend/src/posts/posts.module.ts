import { Module, forwardRef } from '@nestjs/common'
import { PostsService } from './posts.service'
import { PostsController } from './posts.controller'
import { DynamoDBService } from '../common/dynamodb/dynamodb.service'
import { CommentsModule } from '../comments/comments.module'

@Module({
    imports: [forwardRef(() => CommentsModule)],
    controllers: [PostsController],
    providers: [PostsService, DynamoDBService],
    exports: [PostsService],
})
export class PostsModule {}
