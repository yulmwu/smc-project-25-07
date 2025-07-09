import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/http-exception.filter'

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix('api')
    app.useGlobalFilters(new AllExceptionsFilter());
    app.enableCors({
        origin: ['http://smc.rlawnsdud.shop', 'https://smc.rlawnsdud.shop', 'http://localhost:1234', 'https://localhost:1234'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    await app.listen(process.env.PORT ?? 3000, '0.0.0.0')
}

bootstrap()
