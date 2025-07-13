import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { DynamoDBService } from '../common/dynamodb/dynamodb.service'
import { quizData, quizDataRaw } from './quiz.data'
import { GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { SubmitQuizDto } from './dto/submit-quiz.dto'
import { CreateQuizDto } from './dto/create-quiz.dto'

@Injectable()
export class QuizService {
    private readonly tableName = 'QuizUsers'

    constructor(private readonly dynamoDBService: DynamoDBService) {}

    async startQuiz(startQuizDto: CreateQuizDto) {
        const existingUser = await this.dynamoDBService.client.send(
            new GetCommand({
                TableName: this.tableName,
                Key: { username: startQuizDto.username },
            })
        )

        if (existingUser.Item) {
            throw new ConflictException('User has already started the quiz.')
        }

        const newUser = {
            username: startQuizDto.username,
            score: 0,
            submitted: false,
            createdAt: new Date().toISOString(),
            submittedAt: null,
        }

        await this.dynamoDBService.client.send(
            new PutCommand({
                TableName: this.tableName,
                Item: newUser,
            })
        )

        return {
            message: 'User created. Please solve the quiz.',
            quiz: quizData,
        }
    }

    async submitQuiz(submitQuizDto: SubmitQuizDto) {
        const userResult = await this.dynamoDBService.client.send(
            new GetCommand({
                TableName: this.tableName,
                Key: { username: submitQuizDto.username },
            })
        )

        if (!userResult.Item) {
            throw new NotFoundException('User not found.')
        }

        if (userResult.Item.submitted) {
            throw new ConflictException('User has already submitted the quiz.')
        }

        let score = 0
        for (let i = 0; i < quizDataRaw.answers.length; i++) {
            if (
                submitQuizDto.answers[i] &&
                submitQuizDto.answers[i].toLowerCase() === quizDataRaw.answers[i].toLowerCase()
            ) {
                score += quizDataRaw.questions[i].score ?? 1
            }
        }

        const updatedUser = {
            ...userResult.Item,
            score,
            submitted: true,
            createdAt: userResult.Item.createdAt,
            submittedAt: new Date().toISOString(),
        }

        await this.dynamoDBService.client.send(
            new PutCommand({
                TableName: this.tableName,
                Item: updatedUser,
            })
        )

        const rankings = await this.getRankings()
        const userRank = rankings.findIndex((rank) => rank.username === submitQuizDto.username) + 1

        const duration =
            (new Date(updatedUser.submittedAt).getTime() - new Date(updatedUser.createdAt).getTime()) / 1000

        return {
            message: 'Quiz submitted successfully.',
            score,
            rank: userRank,
            createdAt: updatedUser.createdAt,
            submittedAt: updatedUser.submittedAt,
            duration: Math.round(duration),
        }
    }

    async getRankings() {
        const scanResult = await this.dynamoDBService.client.send(
            new ScanCommand({
                TableName: this.tableName,
                FilterExpression: 'submitted = :submitted',
                ExpressionAttributeValues: {
                    ':submitted': true,
                },
            })
        )

        const sortedUsers = (scanResult.Items ?? [])
            .sort((a, b) => b.score - a.score)
            .map((item, index) => {
                const duration = (new Date(item.submittedAt).getTime() - new Date(item.createdAt).getTime()) / 1000
                return {
                    rank: index + 1,
                    username: item.username,
                    score: item.score,
                    createdAt: item.createdAt,
                    submittedAt: item.submittedAt,
                    duration: Math.round(isNaN(duration) ? 0 : duration),
                }
            })

        return sortedUsers
    }
}
