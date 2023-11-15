import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entity/question.entity';
import { TypeormQuestionsRepository } from './repository/typeorm-questions.repository';
import { QUESTIONS_REPOSITORY } from 'src/common/constants/tokens.constant';
import { WriterCheckService } from './domain/writer-check.service';

@Module({
  imports:[TypeOrmModule.forFeature([Question])],
  controllers: [QuestionsController],
  providers: [
    QuestionsService,
    WriterCheckService,
    {
      provide: QUESTIONS_REPOSITORY,
      useClass: TypeormQuestionsRepository,
    }
  ],
  exports: [QuestionsService],
})
export class QuestionsModule {}
