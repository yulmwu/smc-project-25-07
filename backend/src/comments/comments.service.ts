import { Injectable } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import { DynamoDBService } from '../common/dynamodb/dynamodb.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import * as bcrypt from 'bcrypt'
import { PutCommand, QueryCommand, GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { PostsService } from '../posts/posts.service' // Import PostsService
import { isMasterKeyValid } from 'src/utils/masterKey'
import { Invalid, InvalidType, NotFoundError } from 'src/common/errors'

@Injectable()
export class CommentsService {
    private readonly tableName = 'smc-07-comments'

    constructor(
        private readonly dynamoDB: DynamoDBService,
        private readonly postsService: PostsService,
    ) {}

    async create(dto: CreateCommentDto, postId: number) {
        const hashedPassword = await bcrypt.hash(dto.password, 10)

        const comment = {
            id: uuidv4(),
            postId: postId,
            author: dto.author,
            password: hashedPassword,
            content: dto.content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        await this.dynamoDB.client.send(
            new PutCommand({
                TableName: this.tableName,
                Item: comment,
            })
        )

        await this.postsService.incrementCommentCount(postId);

        return { id: comment.id, author: comment.author, content: comment.content }
    }

    async findByPost(postId: number) {
        const result = await this.dynamoDB.client.send(
            new QueryCommand({
                TableName: this.tableName,
                IndexName: 'smc-07-comments-index-1',
                KeyConditionExpression: 'postId = :postId',
                ExpressionAttributeValues: {
                    ':postId': postId,
                },
            })
        )
        return result.Items
    }

    async findOne(id: string) {
        const result = await this.dynamoDB.client.send(
            new GetCommand({
                TableName: this.tableName,
                Key: { id },
            })
        )
        return result.Item
    }

    async update(id: string, dto: UpdateCommentDto) {
        const existing = await this.findOne(id)
        if (!existing) throw new NotFoundError('Comment not found')

        const isMatch = await bcrypt.compare(dto.password, existing.password) || isMasterKeyValid(dto.password)
        if (!isMatch) throw new Invalid('Invalid password', InvalidType.Password)

        await this.dynamoDB.client.send(
            new UpdateCommand({
                TableName: this.tableName,
                Key: { id },
                UpdateExpression: 'SET content = :content, updatedAt = :updatedAt',
                ExpressionAttributeValues: {
                    ':content': dto.content,
                    ':updatedAt': new Date().toISOString(),
                },
            })
        )

        return { id }
    }

    async remove(id: string, password: string) {
        const existing = await this.findOne(id)
        if (!existing) throw new NotFoundError('Comment not found')

        const isMatch = await bcrypt.compare(password, existing.password) || isMasterKeyValid(password)
        if (!isMatch) throw new Invalid('Invalid password', InvalidType.Password)

        await this.dynamoDB.client.send(
            new DeleteCommand({
                TableName: this.tableName,
                Key: { id },
            })
        )

        await this.postsService.decrementCommentCount(existing.postId);

        return { id }
    }
}
