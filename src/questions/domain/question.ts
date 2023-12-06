import { User } from 'src/users/domain/user';
import { Content } from './vo/content';
import { Title } from './vo/title';
import { ForbiddenException } from '@nestjs/common';
import { IsNotQuestionWriter } from 'src/common/exception/error-types';

export class Question {
  constructor(options: {
    id?: number; 
    title: Title;
    content: Content;
    createdAt?: Date;
    userId: number;
    commentIds: number[];
    likeIds: number[];
    bookmarkIds: number[];
  }) {
    if (options) {
      if (options.id) {
        this.id = options.id;
      }
      this.title = options.title;
      this.content = options.content;
      if (options.createdAt) {
        this.createdAt = options.createdAt;
      }
      this.userId = options.userId;
      this.commentIds = options.commentIds;
      this.likeIds = options.likeIds;
      this.bookmarkIds = options.bookmarkIds;
    }
  }

  private id: number;
  
  private title: Title;

  private content: Content;

  private createdAt: Date;

  private userId: number;

  private commentIds: number[];

  private likeIds: number[];

  private bookmarkIds: number[];

  public checkIsAuthor(user: User): void {
    const userId = user.getId();

    if (this.userId !== userId) {
      throw new ForbiddenException(IsNotQuestionWriter.message, IsNotQuestionWriter.name);
    }
  }

  public update(title: string, content: string, user?: User): void {
    this.title = new Title(title);
    this.content = new Content(content);
  }

  public getId() {
    return this.id;
  }
}
