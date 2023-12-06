import { QuestionEntity } from 'src/questions/infrastructure/entity/question.entity';
import { User } from 'src/users/infrastructure/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('bookmark')
export class BookmarkEntity {
  // constructor(options: {
  //   user: User,
  //   question: QuestionEntity
  // }) {
  //   if (options) {
  //     this.user = options.user;
  //     this.question = options.question;
  //   }
  // }

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @ManyToOne(() => User, user => user.bookmarks, {
    onDelete: 'CASCADE',
    nullable: false
  })
  user: User;

  @ManyToOne(() => QuestionEntity, question => question.bookmarks, {
    onDelete: 'CASCADE',
    nullable: false
  })
  question: QuestionEntity;
}
