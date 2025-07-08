import { Module } from '@nestjs/common'
import { PostsService } from './posts.service'
import { PostsController } from './posts.controller'
import { DynamoDBService } from '../common/dynamodb/dynamodb.service'

@Module({
    controllers: [PostsController],
    providers: [PostsService, DynamoDBService],
})
export class PostsModule {}
