import { Question } from 'src/questions/infrastructure/entity/question.entity';
import { User } from 'src/users/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class QuestionLike {
  constructor(options: {
    user: User,
    question: Question
  }) {
    if (options) {
      this.user = options.user;
      this.question = options.question;
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @ManyToOne(() => User, user => user.questionLikes, {
    onDelete: 'CASCADE',
    nullable: false
  })
  user: User;

  @ManyToOne(() => Question, question => question.likes, {
    onDelete: 'CASCADE',
    nullable: false
  })
  question: Question;
}
