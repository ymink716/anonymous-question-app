import { QuestionLike } from "src/likes/domain/question.like";
import { QuestionLikeEntity } from "../entity/question-like.entity";
import { QuestionEntity } from "src/questions/infrastructure/entity/question.entity";
import { UserEntity } from "src/users/infrastructure/entity/user.entity";



export class QeustionLikeMapper {
  public static toDomain(questionLikeEntity: QuestionLikeEntity): QuestionLike {
    const { id, user, question } = questionLikeEntity;

    const questionLike = new QuestionLike({
      id, 
      userId: user.id, 
      questionId: question.id
    });

    return questionLike;
  }

  public static toPersistence(questionLike: QuestionLike): QuestionLikeEntity {
    const id = questionLike['id'];
    const userId = questionLike['userId'];
    const questionId = questionLike['questionId'];
    
    const questionLikeEntity = new QuestionLikeEntity();

    if (id) {
      questionLikeEntity.id = id;
    }

    const userEntity = new UserEntity();
    userEntity.id = userId;
    questionLikeEntity.user = userEntity;

    const questionEntity = new QuestionEntity();
    questionEntity.id = questionId;
    questionLikeEntity.question = questionEntity;

    return questionLikeEntity;
  }
}