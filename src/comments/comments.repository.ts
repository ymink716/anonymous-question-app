import { Comment } from "./entity/comment.entity";

export interface CommentsRepository {
  findOneById(id: number): Promise<Comment | null>;
  save(comment: Comment): Promise<Comment>;
  update(comment: Comment, content: string): Promise<Comment>;
  softDelete(id: number): Promise<void>;
}