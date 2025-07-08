import { Module } from '@nestjs/common'
import { CommentsService } from './comments.service'
import { CommentsController } from './comments.controller'
import { DynamoDBService } from '../common/dynamodb/dynamodb.service'

@Module({
    controllers: [CommentsController],
    providers: [CommentsService, DynamoDBService],
})
export class CommentsModule {}
