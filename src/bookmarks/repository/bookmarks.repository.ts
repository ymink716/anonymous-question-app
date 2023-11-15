import { Bookmark } from "../entity/bookmark.entity";

export interface BookmarksRepository {
  countByUserIdAndQuestionId(userId: number, questionId: number): Promise<number>;
  save(bookmark: Bookmark): Promise<Bookmark>;
  findByUserIdAndQuestionId(userId: number, questionId: number): Promise<Bookmark[]>;
  delete(bookmarkId: number): Promise<void>;
}