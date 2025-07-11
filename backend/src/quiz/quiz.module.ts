import { Module } from '@nestjs/common'
import { QuizController } from './quiz.controller'
import { QuizService } from './quiz.service'
import { DynamoDBService } from '../common/dynamodb/dynamodb.service'

@Module({
    controllers: [QuizController],
    providers: [QuizService, DynamoDBService],
})
export class QuizModule {}
