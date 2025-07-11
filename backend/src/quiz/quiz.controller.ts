import { Controller, Post, Body, Get } from '@nestjs/common'
import { QuizService } from './quiz.service'
import { CreateQuizDto } from './dto/create-quiz.dto'
import { SubmitQuizDto } from './dto/submit-quiz.dto'

@Controller('quiz')
export class QuizController {
    constructor(private readonly quizService: QuizService) {}

    @Post()
    startQuiz(@Body() createQuizDto: CreateQuizDto) {
        return this.quizService.startQuiz(createQuizDto.username)
    }

    @Post('submit')
    submitQuiz(@Body() submitQuizDto: SubmitQuizDto) {
        return this.quizService.submitQuiz(submitQuizDto.username, submitQuizDto.answers)
    }

    @Get('rankings')
    getRankings() {
        return this.quizService.getRankings()
    }
}
