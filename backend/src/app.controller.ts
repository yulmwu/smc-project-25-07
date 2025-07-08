import { Controller, Get, Param } from '@nestjs/common'
import { AppService } from './app.service'

@Controller('api')
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    @Get('/hello')
    getHello(): string {
        return this.appService.getHello()
    }

    @Get('/greet/:username')
    getGreet(@Param('username') username: string): string {
        return `Hello, ${username}!`
    }

    @Get('/health')
    getHealth(): string {
        return 'OK'
    }
}
