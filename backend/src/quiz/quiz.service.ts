import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { DynamoDBService } from '../common/dynamodb/dynamodb.service'
import { quizData } from './quiz.data'
import { GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'

/*
AWS DynamoDB 테이블 설정 가이드
---------------------------------
1. AWS Management Console에 로그인하여 DynamoDB 서비스로 이동합니다.
2. "테이블 만들기" 버튼을 클릭합니다.
3. 테이블 이름: "QuizUsers" (혹은 원하는 다른 이름)
4. 파티션 키: "username" (타입: 문자열)
5. 테이블 설정: "기본 설정 사용" 혹은 필요에 따라 프로비저닝된 용량 설정. (개발/테스트 단계에서는 온디맨드 용량 모드가 편리합니다.)
6. "테이블 만들기" 클릭하여 생성을 완료합니다.

- 테이블 이름은 아래 `tableName` 변수와 일치해야 합니다.
- 랭킹 기능을 확장성 있게 구현하려면 'score' 속성에 대한 글로벌 보조 인덱스(GSI)를 생성하는 것을 고려할 수 있습니다.
  - GSI 설정:
    - 파티션 키: 'submitted' (타입: 숫자, 1일 경우 제출 완료)
    - 정렬 키: 'score' (타입: 숫자)
  - 이렇게 하면 제출된 사용자를 효율적으로 쿼리하고 점수 순으로 정렬할 수 있습니다.
*/

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
            quiz: quizData.questions,
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
        for (let i = 0; i < quizData.answers.length; i++) {
            if (answers[i] && answers[i].toLowerCase() === quizData.answers[i].toLowerCase()) {
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
