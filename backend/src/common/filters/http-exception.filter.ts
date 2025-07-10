import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common'
import { Response } from 'express'
import { BadRequestError, Invalid, NotFoundError } from '../errors'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()

        let status = HttpStatus.INTERNAL_SERVER_ERROR
        let message = 'Internal server error'
        let type: string | undefined

        if (exception instanceof NotFoundError) {
            status = HttpStatus.NOT_FOUND
            message = exception.message
        } else if (exception instanceof BadRequestError) {
            status = HttpStatus.BAD_REQUEST
            message = exception.message
        } else if (exception instanceof Invalid) {
            status = HttpStatus.BAD_REQUEST
            message = exception.message
            type = exception.type
        } else if (exception instanceof Error) {
            message = exception.message
            console.error('Unexpected error:', exception)
        }

        response.status(status).json({
            statusCode: status,
            message,
            type,
        })
    }
}
