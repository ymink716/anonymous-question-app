import { Bookmark } from "src/bookmarks/domain/bookmark";
import { BookmarkEntity } from "../entity/bookmark.entity";
import { User } from "src/users/entity/user.entity";
import { QuestionEntity } from "src/questions/infrastructure/entity/question.entity";

export class BookmarkMapper {
  public static toDomain(bookmarkEntity: BookmarkEntity): Bookmark {
    const { id, createdAt, user, question } = bookmarkEntity;

    const bookmark = new Bookmark({
      id, 
      createdAt, 
      userId: user.id, 
      questionId: question.id,
    });

    return bookmark;
  }

  public static toPersistence(bookmark: Bookmark): BookmarkEntity {
    const id = bookmark['id'];
    const userId = bookmark['userId'];
    const questionId = bookmark['questionId'];

    const bookmarkEntity = new BookmarkEntity();

    if (id) {
      bookmarkEntity.id = id;
    }
    bookmarkEntity.user = Object.assign(new User(), { id: userId });
    bookmarkEntity.question = Object.assign(new QuestionEntity(), { id: questionId });

    return bookmarkEntity;
  }
}