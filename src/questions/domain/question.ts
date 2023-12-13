import { User } from 'src/users/domain/user';
import { Content } from './content';
import { Title } from './title';
import { ForbiddenException } from '@nestjs/common';
import { IsNotQuestionWriter } from 'src/common/exception/error-types';

export class Question {
  constructor(options: {
    id?: number; 
    title: Title;
    content: Content;
    createdAt?: Date;
    userId: number;
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
    }
  }

  private id: number;
  
  private title: Title;

  private content: Content;

  private createdAt: Date;

  private userId: number;

  public checkIsAuthor(userId: number): void {
    if (this.userId !== userId) {
      throw new ForbiddenException(IsNotQuestionWriter.message, IsNotQuestionWriter.name);
    }

    return;
  }

  public update(title: string, content: string): void {
    this.title = new Title(title);
    this.content = new Content(content);
  }

  public getId() {
    return this.id;
  }
}
