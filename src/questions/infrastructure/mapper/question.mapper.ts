import { Question } from "src/questions/domain/question";
import { QuestionEntity } from "../entity/question.entity";
import { Title } from "src/questions/domain/vo/title";
import { Content } from "src/questions/domain/vo/content";
import { User } from "src/users/entity/user.entity";

export class QuestionMapper {
  public static toDomain(questionEntity: QuestionEntity): Question {
    const { id, title, content, createdAt, user, comments, likes, bookmarks } = questionEntity;

    const question = new Question({
      id, 
      title: new Title(title), 
      content: new Content(content), 
      createdAt, 
      userId: user.id, 
      commentIds: comments.map((comment) => comment.id), 
      likeIds: likes.map((like) => like.id), 
      bookmarkIds: bookmarks.map((boomark) => boomark.id),
    });

    return question;
  }

  public static toPersistence(question: Question): QuestionEntity {
    const id = question['id'];
    const title = question['title'];
    const content = question['content'];
    const userId = question['userId'];
    
    const questionEntity = new QuestionEntity();

    if (id) {
      questionEntity.id = id;
    }
    questionEntity.title = title.getTitle();
    questionEntity.content = content.getContent();
    questionEntity.user = Object.assign(new User(), { id: userId });

    return questionEntity;
  }
}