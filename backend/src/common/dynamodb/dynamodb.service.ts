import { Injectable } from '@nestjs/common'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

@Injectable()
export class DynamoDBService {
    private readonly docClient: DynamoDBDocumentClient

    constructor() {
        const client = new DynamoDBClient({
            region: 'ap-northeast-2',
        })

        this.docClient = DynamoDBDocumentClient.from(client, {
            marshallOptions: {
                removeUndefinedValues: true,
            },
        })
    }

    get client() {
        return this.docClient
    }
}
