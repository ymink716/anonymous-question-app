import { Injectable } from "@nestjs/common";
import { QuestionLikesRepository } from "./question-likes.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { QuestionLike } from "./entity/question-like.entity";
import { Question } from "src/questions/entity/question.entity";
import { User } from "src/users/entity/user.entity";

@Injectable()
export class TypeormQuestionLikesRepository implements QuestionLikesRepository {
  constructor(
    @InjectRepository(QuestionLike)
    private readonly questionLikesRepository: Repository<QuestionLike>,
  ) {}
  async findOneById(id: number): Promise<QuestionLike | null> {
    const questionLike = await this.questionLikesRepository.findOne({ 
      where: { id },
      relations: ['user', 'question'],
    });

    return questionLike;
  }

  async count(userId: number, questionId: number): Promise<number> {
    const questionLikesCount = await this.questionLikesRepository.count({
      relations: {
        user: true,
        question: true,
      },      
      where: {
        user: {
          id: userId,
        },
        question: {
          id: questionId,
        }
      },
    });

    return questionLikesCount;
  }

  async save(questionLike: QuestionLike): Promise<QuestionLike> {
    const savedQuestionLike = await this.questionLikesRepository.save(questionLike);

    return savedQuestionLike;
  }

  async delete(id: number): Promise<void> {
    await this.questionLikesRepository.delete({ id });
  }
}