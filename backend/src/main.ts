import * as dotenv from 'dotenv'
dotenv.config()

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/http-exception.filter'
import { MASTER_KEY } from './utils/masterKey'

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix('api')
    app.useGlobalFilters(new AllExceptionsFilter());
    app.enableCors({
        origin: ['http://chosun.rlawnsdud.shop', 'https://chosun.rlawnsdud.shop', 'http://localhost:1234', 'https://localhost:1234'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    console.log('Server is running on port:', process.env.PORT ?? 3000)
    console.log('MASTER_KEY:', MASTER_KEY)
    await app.listen(process.env.PORT ?? 3000, '0.0.0.0')
}

bootstrap()
