import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { DynamoDBService } from '../common/dynamodb/dynamodb.service'
import { quizData, quizDataRaw } from './quiz.data'
import { GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'

@Injectable()
export class QuizService {
    private readonly tableName = 'QuizUsers'

    constructor(private readonly dynamoDBService: DynamoDBService) {}

    async startQuiz(username: string) {
        const existingUser = await this.dynamoDBService.client.send(
            new GetCommand({
                TableName: this.tableName,
                Key: { username },
            })
        )

        if (existingUser.Item) {
            throw new ConflictException('User has already started the quiz.')
        }

        const newUser = {
            username,
            score: 0,
            submitted: false,
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

    async submitQuiz(username: string, answers: string[]) {
        const userResult = await this.dynamoDBService.client.send(
            new GetCommand({
                TableName: this.tableName,
                Key: { username },
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
            if (answers[i] && answers[i].toLowerCase() === quizDataRaw.answers[i].toLowerCase()) {
                score++
            }
        }

        const updatedUser = {
            ...userResult.Item,
            score,
            submitted: true,
            submittedAt: new Date().toISOString(),
        }

        await this.dynamoDBService.client.send(
            new PutCommand({
                TableName: this.tableName,
                Item: updatedUser,
            })
        )

        const rankings = await this.getRankings()
        const userRank = rankings.findIndex((rank) => rank.username === username) + 1

        return {
            message: 'Quiz submitted successfully.',
            score,
            rank: userRank,
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
            .map((item, index) => ({
                rank: index + 1,
                username: item.username,
                score: item.score,
            }))

        return sortedUsers
    }
}
