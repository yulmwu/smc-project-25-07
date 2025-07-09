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

        if (exception instanceof NotFoundError) {
            status = HttpStatus.NOT_FOUND
            message = exception.message
        } else if (exception instanceof BadRequestError || exception instanceof Invalid) {
            status = HttpStatus.BAD_REQUEST
            message = exception.message
        } else if (exception instanceof Error) {
            message = exception.message
        }

        response.status(status).json({
            statusCode: status,
            message,
        })
    }
}
