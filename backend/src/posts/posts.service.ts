import { Injectable } from '@nestjs/common'
import { DynamoDBService } from '../common/dynamodb/dynamodb.service'
import { CreatePostDto } from './dto/create-post.dto'
import * as bcrypt from 'bcrypt'
import { PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { UpdatePostDto } from './dto/update-post.dto'
import { Invalid, NotFoundError } from 'src/common/errors'

@Injectable()
export class PostsService {
    private readonly tableName = 'smc-07-posts'

    constructor(private readonly dynamoDB: DynamoDBService) {}

    async nextId(): Promise<number> {
        const command = new UpdateCommand({
            TableName: 'Counter',
            Key: { name: 'smc-07-posts' },
            UpdateExpression: 'SET #v = if_not_exists(#v, :init) + :inc',
            ExpressionAttributeNames: { '#v': 'value' },
            ExpressionAttributeValues: {
                ':inc': 1,
                ':init': 0,
            },
            ReturnValues: 'UPDATED_NEW',
        })

        const result = await this.dynamoDB.client.send(command)
        return result.Attributes?.value
    }

    async create(createPostDto: CreatePostDto) {
        const hashedPassword = await bcrypt.hash(createPostDto.password, 10)

        const post = {
            id: await this.nextId(),
            author: createPostDto.author,
            password: hashedPassword,
            title: createPostDto.title,
            content: createPostDto.content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        await this.dynamoDB.client.send(
            new PutCommand({
                TableName: this.tableName,
                Item: post,
            })
        )

        return { id: post.id, author: post.author, title: post.title, content: post.content }
    }

    async findOne(id: number) {
        const result = await this.dynamoDB.client.send(
            new GetCommand({
                TableName: this.tableName,
                Key: { id },
            })
        )
        return result.Item
    }

    async findAll() {
        const result = await this.dynamoDB.client.send(
            new ScanCommand({
                TableName: this.tableName,
            })
        )
        return result.Items
    }

    async update(id: number, dto: UpdatePostDto) {
        const post = await this.findOne(id)
        if (!post) {
            throw new NotFoundError(`Post with id ${id} not found`)
        }

        const isPasswordValid = await bcrypt.compare(dto.password, post.password)
        if (!isPasswordValid) {
            throw new Invalid(`Invalid password for post with id ${id}`)
        }

        await this.dynamoDB.client.send(
            new UpdateCommand({
                TableName: this.tableName,
                Key: { id },
                UpdateExpression: 'SET title = :title, content = :content, updatedAt = :updatedAt',
                ExpressionAttributeValues: {
                    ':title': dto.title,
                    ':content': dto.content,
                    ':updatedAt': new Date().toISOString(),
                },
            })
        )
        return { id }
    }

    async remove(id: number, password: string) {
        const post = await this.findOne(id)
        if (!post) {
            throw new NotFoundError(`Post with id ${id} not found`)
        }

        const isPasswordValid = await bcrypt.compare(password, post.password)
        if (!isPasswordValid) {
            throw new Invalid(`Invalid password for post with id ${id}`)
        }

        await this.dynamoDB.client.send(
            new DeleteCommand({
                TableName: this.tableName,
                Key: { id },
            })
        )
        return { id }
    }
}
