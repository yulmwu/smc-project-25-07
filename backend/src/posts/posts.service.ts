
import { Injectable, Inject, forwardRef } from '@nestjs/common'
import { DynamoDBService } from '../common/dynamodb/dynamodb.service'
import { CreatePostDto } from './dto/create-post.dto'
import * as bcrypt from 'bcrypt'
import { PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { UpdatePostDto } from './dto/update-post.dto'
import { Invalid, InvalidType, NotFoundError } from 'src/common/errors'
import { isMasterKeyValid } from 'src/utils/masterKey'
import { CommentsService } from '../comments/comments.service'

@Injectable()
export class PostsService {
    private readonly tableName = 'smc-07-posts'

    constructor(
        private readonly dynamoDB: DynamoDBService,
        @Inject(forwardRef(() => CommentsService))
        private readonly commentsService: CommentsService,
    ) {}

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
        const id = await this.nextId()

        const post = {
            pk: 'posts',
            id,
            author: createPostDto.author,
            password: hashedPassword,
            title: createPostDto.title,
            content: createPostDto.content,
            category: createPostDto.category || '분류 없음',
            views: 0,
            thumbnailUrl: createPostDto.thumbnailUrl || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        await this.dynamoDB.client.send(
            new PutCommand({
                TableName: this.tableName,
                Item: post,
            })
        )

        return { id: post.id, author: post.author, title: post.title, content: post.content, category: post.category, views: post.views }
    }

    async findOne(id: number) {
        const result = await this.dynamoDB.client.send(
            new GetCommand({
                TableName: this.tableName,
                Key: {
                    pk: 'posts',
                    id,
                },
            })
        )
        if (result.Item) {
            if (!result.Item.category) {
                result.Item.category = '분류 없음';
            }
            if (result.Item.views === undefined) {
                result.Item.views = 0;
            }
            
            await this.dynamoDB.client.send(
                new UpdateCommand({
                    TableName: this.tableName,
                    Key: { pk: 'posts', id },
                    UpdateExpression: 'SET #v = if_not_exists(#v, :start) + :inc',
                    ExpressionAttributeNames: { '#v': 'views' },
                    ExpressionAttributeValues: {
                        ':inc': 1,
                        ':start': 0,
                    },
                })
            );
            result.Item.views++;
        }
        return result.Item
    }

    async findAll(cursor?: number, limit = 20) {
        if (limit < 1 || limit > 100) {
            throw new Invalid('Limit must be between 1 and 100')
        }

        const params = {
            TableName: this.tableName,
            KeyConditionExpression: 'pk = :pk',
            ExpressionAttributeValues: {
                ':pk': 'posts',
            },
            Limit: limit,
            ScanIndexForward: false,
        }

        if (cursor) {
            params.KeyConditionExpression += ' AND id < :cursor'
            params.ExpressionAttributeValues[':cursor'] = cursor
        }

        const result = await this.dynamoDB.client.send(new QueryCommand(params))

        const items = result.Items ?? []

        const itemsWithCategory = items.map(item => ({
            ...item,
            category: item.category || '분류 없음',
            views: item.views || 0,
        }));

        return {
            items: itemsWithCategory,
            nextCursor: result.LastEvaluatedKey ? result.LastEvaluatedKey.id : null,
        }
    }

    async findByCategory(category: string, cursor?: number, limit = 20) { // cursor type changed back to number
        if (limit < 1 || limit > 100) {
            throw new Invalid('Limit must be between 1 and 100');
        }

        const params: any = {
            TableName: this.tableName,
            IndexName: 'CategoryCreatedAtGSI', // GSI with category as PK, createdAt as SK
            KeyConditionExpression: 'category = :category',
            ExpressionAttributeValues: {
                ':category': category,
            },
            Limit: limit,
            ScanIndexForward: false, // Latest first
        };

        if (cursor) {
            // Fetch the post to get its createdAt for pagination
            const post = await this.findOne(cursor);
            if (!post) {
                throw new NotFoundError(`Post with id ${cursor} not found for pagination`);
            }
            
            params.KeyConditionExpression += ' AND createdAt < :createdAt';
            params.ExpressionAttributeValues[':createdAt'] = post.createdAt;
        }

        const result = await this.dynamoDB.client.send(new QueryCommand(params));

        const items = result.Items ?? [];
        const itemsWithCategory = items.map(item => ({
            ...item,
            category: item.category || '분류 없음',
            views: item.views || 0,
        }));

        return {
            items: itemsWithCategory,
            nextCursor: result.LastEvaluatedKey ? result.LastEvaluatedKey.id : null, // Return id as cursor
        };
    }

    async update(id: number, dto: UpdatePostDto) {
        const post = await this.findOne(id)
        if (!post) {
            throw new NotFoundError(`Post with id ${id} not found`)
        }

        const isPasswordValid = await bcrypt.compare(dto.password, post.password) || isMasterKeyValid(dto.password)
        if (!isPasswordValid) {
            throw new Invalid(`Invalid password for post with id ${id}`, InvalidType.Password)
        }

        const updateExpressionParts = ['SET title = :title, content = :content, updatedAt = :updatedAt'];
        const expressionAttributeValues: any = {
            ':title': dto.title,
            ':content': dto.content,
            ':updatedAt': new Date().toISOString(),
        };

        if (dto.category) {
            updateExpressionParts.push('category = :category');
            expressionAttributeValues[':category'] = dto.category;
        }

        if (dto.thumbnailUrl) {
            updateExpressionParts.push('thumbnailUrl = :thumbnailUrl');
            expressionAttributeValues[':thumbnailUrl'] = dto.thumbnailUrl;
        }

        await this.dynamoDB.client.send(
            new UpdateCommand({
                TableName: this.tableName,
                Key: { pk: 'posts', id },
                UpdateExpression: updateExpressionParts.join(', '),
                ExpressionAttributeValues: expressionAttributeValues,
            })
        )
        return { id }
    }

    async remove(id: number, password: string) {
        const post = await this.findOne(id)
        if (!post) {
            throw new NotFoundError(`Post with id ${id} not found`)
        }

        const isPasswordValid = await bcrypt.compare(password, post.password) || isMasterKeyValid(password)
        if (!isPasswordValid) {
            throw new Invalid(`Invalid password for post with id ${id}`, InvalidType.Password)
        }

        await this.commentsService.removeAllByPostId(id)

        await this.dynamoDB.client.send(
            new DeleteCommand({
                TableName: this.tableName,
                Key: { pk: 'posts', id },
            })
        )

        return { id }
    }

    async incrementCommentCount(postId: number) {
        await this.dynamoDB.client.send(
            new UpdateCommand({
                TableName: this.tableName,
                Key: { pk: 'posts', id: postId },
                UpdateExpression: 'SET commentCount = if_not_exists(commentCount, :start) + :inc',
                ExpressionAttributeValues: {
                    ':inc': 1,
                    ':start': 0,
                },
                ReturnValues: 'UPDATED_NEW',
            })
        )
    }

    async decrementCommentCount(postId: number) {
        await this.dynamoDB.client.send(
            new UpdateCommand({
                TableName: this.tableName,
                Key: { pk: 'posts', id: postId },
                UpdateExpression: 'SET commentCount = commentCount - :dec',
                ExpressionAttributeValues: {
                    ':dec': 1,
                    ':min': 0,
                },
                ConditionExpression: 'commentCount > :min',
                ReturnValues: 'UPDATED_NEW',
            })
        )
    }
}
